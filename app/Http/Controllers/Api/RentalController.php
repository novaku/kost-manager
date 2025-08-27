<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Rental;
use App\Models\Room;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class RentalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
            }

            $query = Rental::with(['room.kostan', 'tenant']);

            if ($user->role === 'owner') {
                // Rentals for kostans owned by this owner
                $query->whereHas('room.kostan', function ($q) use ($user) {
                    $q->where('owner_id', $user->id);
                });
            } elseif ($user->role === 'tenant') {
                $query->where('tenant_id', $user->id);
            }

            // Optional filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            if ($request->has('kostan_id')) {
                $query->whereHas('room.kostan', function ($q) use ($request) {
                    $q->where('id', $request->kostan_id);
                });
            }

            $rentals = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 15));

            return response()->json(['success' => true, 'data' => $rentals]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve rentals',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    // Not used in API

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $user = $request->user();
            if (!$user || $user->role !== 'tenant') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'room_id' => 'required|exists:rooms,id',
                'start_date' => 'required|date|after_or_equal:today',
                'end_date' => 'required|date|after:start_date',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $room = Room::find($request->room_id);
            if (!$room || $room->status !== 'available') {
                return response()->json(['success' => false, 'message' => 'Room not available'], 400);
            }

            $rental = Rental::create([
                'room_id' => $room->id,
                'tenant_id' => $user->id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Rental application submitted',
                'data' => $rental->load(['room.kostan'])
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create rental',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id): \Illuminate\Http\JsonResponse
    {
        try {
            $rental = Rental::with(['room.kostan', 'tenant'])->find($id);
            if (!$rental) {
                return response()->json(['success' => false, 'message' => 'Rental not found'], 404);
            }

            $user = request()->user();
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
            }

            // Owner can view if rental belongs to their kostan
            if ($user->role === 'owner') {
                $isRelated = $rental->room && $rental->room->kostan && $rental->room->kostan->owner_id === $user->id;
                if (! $isRelated) {
                    return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
                }
            }
            // Tenant can view their own rental
            if ($user->role === 'tenant' && $rental->tenant_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            return response()->json(['success' => true, 'data' => $rental]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve rental',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    // Not used in API

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): \Illuminate\Http\JsonResponse
    {
        try {
            $user = $request->user();
            $rental = Rental::find($id);
            if (!$rental) {
                return response()->json(['success' => false, 'message' => 'Rental not found'], 404);
            }

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
            }

            // Only owner of kostan can update rental status
            if ($user->role !== 'owner' || !$rental->room || !$rental->room->kostan || $rental->room->kostan->owner_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'status' => 'required|in:active,pending,expired,rejected',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $rental->status = $request->status;
            $rental->save();

            return response()->json([
                'success' => true,
                'message' => 'Rental updated',
                'data' => $rental->load(['room.kostan', 'tenant'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update rental',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): \Illuminate\Http\JsonResponse
    {
        try {
            $user = request()->user();
            $rental = Rental::find($id);
            if (!$rental) {
                return response()->json(['success' => false, 'message' => 'Rental not found'], 404);
            }

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
            }

            // Owner can delete if rental belongs to their kostan, tenant can delete their own rental
            $isOwner = $user->role === 'owner' && $rental->room && $rental->room->kostan && $rental->room->kostan->owner_id === $user->id;
            $isTenant = $user->role === 'tenant' && $rental->tenant_id === $user->id;
            if (!($isOwner || $isTenant)) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $rental->delete();

            return response()->json(['success' => true, 'message' => 'Rental deleted']);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete rental',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Tenant: list only their rentals (paginated)
     */
    public function myRentals(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $user = $request->user();
            if (!$user || $user->role !== 'tenant') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $rentals = Rental::with(['room.kostan', 'tenant'])
                ->where('tenant_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 15));

            return response()->json(['success' => true, 'data' => $rentals]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve my rentals',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Tenant: alias for store/apply
     */
    public function apply(Request $request): \Illuminate\Http\JsonResponse
    {
        return $this->store($request);
    }

    /**
     * Owner: list pending rental applications for owner's kostans
     */
    public function applications(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $user = $request->user();
            if (!$user || $user->role !== 'owner') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $query = Rental::with(['room.kostan', 'tenant'])
                ->whereHas('room.kostan', function ($q) use ($user) {
                    $q->where('owner_id', $user->id);
                })
                ->where('status', 'pending');

            $rentals = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 15));

            return response()->json(['success' => true, 'data' => $rentals]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve applications',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Owner: approve a rental application
     */
    public function approve(Request $request, $id): \Illuminate\Http\JsonResponse
    {
        try {
            $user = $request->user();
            if (!$user || $user->role !== 'owner') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $rental = Rental::with(['room.kostan'])->find($id);
            if (!$rental) {
                return response()->json(['success' => false, 'message' => 'Rental not found'], 404);
            }

            if (! $rental->room || ! $rental->room->kostan || $rental->room->kostan->owner_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $rental->status = 'active';
            $rental->save();

            // Optionally mark room as occupied
            if ($rental->room) {
                $rental->room->status = 'occupied';
                $rental->room->save();
            }

            return response()->json(['success' => true, 'message' => 'Rental approved', 'data' => $rental->load(['room.kostan', 'tenant'])]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve rental',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Owner: reject a rental application
     */
    public function reject(Request $request, $id): \Illuminate\Http\JsonResponse
    {
        try {
            $user = $request->user();
            if (!$user || $user->role !== 'owner') {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $rental = Rental::with(['room.kostan'])->find($id);
            if (!$rental) {
                return response()->json(['success' => false, 'message' => 'Rental not found'], 404);
            }

            if (! $rental->room || ! $rental->room->kostan || $rental->room->kostan->owner_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $rental->status = 'rejected';
            $rental->save();

            return response()->json(['success' => true, 'message' => 'Rental rejected', 'data' => $rental->load(['room.kostan', 'tenant'])]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject rental',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }
}
