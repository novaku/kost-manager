<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Payment;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    /**
     * List payments. For owners, returns payments for their kostans. For tenants, returns their payments.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            $query = Payment::with(['rental.room.kostan', 'tenant']);

            if ($user->role === 'owner') {
                // Payments related to owner's kostans
                $query->whereHas('rental.room.kostan', function ($q) use ($user) {
                    $q->where('owner_id', $user->id);
                });
            } elseif ($user->role === 'tenant') {
                $query->where('tenant_id', $user->id);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $payments = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $payments
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payments',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Return payments for the authenticated tenant (route /my-payments)
     */
    public function myPayments(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'tenant') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            $payments = Payment::with(['rental.room.kostan'])
                ->where('tenant_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $payments
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payments',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Show a single payment with access checks.
     */
    public function show(Request $request, Payment $payment): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
            }

            // Owner can view if payment belongs to their kostan
            if ($user->role === 'owner') {
                $isRelated = $payment->rental && $payment->rental->room && $payment->rental->room->kostan &&
                    $payment->rental->room->kostan->owner_id === $user->id;

                if (! $isRelated) {
                    return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
                }
            }

            // Tenant can view their own payment
            if ($user->role === 'tenant' && $payment->tenant_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $payment->load(['rental.room.kostan', 'tenant']);

            return response()->json(['success' => true, 'data' => $payment]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payment',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Tenant uploads payment receipt for a pending payment.
     */
    public function process(Request $request, Payment $payment): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user || $user->role !== 'tenant') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            // Tenant can only upload receipt for their own payment
            if ($payment->tenant_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            // Only allow uploading when payment is pending
            if ($payment->status !== 'pending') {
                return response()->json(['success' => false, 'message' => 'Payment not in pending state'], 400);
            }

            $validator = Validator::make($request->all(), [
                'receipt' => 'required|file|mimes:jpg,jpeg,png,gif,pdf|max:5120', // max 5MB
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $file = $request->file('receipt');

            // Store in public disk under receipts/
            $path = Storage::disk('public')->putFile('receipts', $file);
            // Generate URL using the filesystem driver to respect disk configuration
            // Use a typed adapter variable so static analyzers recognize the `url` method.
            /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
            $disk = Storage::disk('public');
            if (method_exists($disk, 'url')) {
                $url = $disk->url($path);
            } else {
                // Fallback to the asset path if the adapter doesn't expose url()
                $url = asset('storage/' . $path);
            }

            $payment->receipt_url = $url;
            $payment->status = 'processing';
            $payment->save();

            // Reload relations
            $payment->load(['rental.room.kostan', 'tenant']);

            return response()->json([
                'success' => true,
                'message' => 'Receipt uploaded successfully',
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }
}
