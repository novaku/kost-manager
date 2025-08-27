<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kostan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class KostanController extends Controller
{
    /**
     * Display a listing of kostans (public - for browsing)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Kostan::with(['owner:id,name', 'rooms' => function($q) {
                $q->where('is_active', true);
            }])->where('is_active', true);

            // Search filters
            if ($request->has('city')) {
                $query->where('city', 'like', '%' . $request->city . '%');
            }

            if ($request->has('province')) {
                $query->where('province', 'like', '%' . $request->province . '%');
            }

            if ($request->has('search')) {
                $query->where(function($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                      ->orWhere('description', 'like', '%' . $request->search . '%')
                      ->orWhere('address', 'like', '%' . $request->search . '%');
                });
            }

            // Price range filter
            if ($request->has('min_price') || $request->has('max_price')) {
                $query->whereHas('rooms', function($q) use ($request) {
                    if ($request->has('min_price')) {
                        $q->where('monthly_price', '>=', $request->min_price);
                    }
                    if ($request->has('max_price')) {
                        $q->where('monthly_price', '<=', $request->max_price);
                    }
                });
            }

            // Rating filter
            if ($request->has('min_rating')) {
                $query->where('average_rating', '>=', $request->min_rating);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortDir = $request->get('sort_dir', 'desc');
            
            if (in_array($sortBy, ['name', 'average_rating', 'created_at'])) {
                $query->orderBy($sortBy, $sortDir);
            }

            $kostans = $query->paginate($request->get('per_page', 12));

            return response()->json([
                'success' => true,
                'data' => $kostans
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve kostans',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Store a newly created kostan (owner only)
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'address' => 'required|string',
                'city' => 'required|string|max:100',
                'province' => 'required|string|max:100',
                'postal_code' => 'nullable|string|max:10',
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
                'facilities' => 'nullable|array',
                'rules' => 'nullable|array',
                'images' => 'nullable|array',
                'images.*' => 'string|url',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $kostan = Kostan::create([
                'owner_id' => $request->user()->id,
                'name' => $request->name,
                'description' => $request->description,
                'address' => $request->address,
                'city' => $request->city,
                'province' => $request->province,
                'postal_code' => $request->postal_code,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'facilities' => $request->facilities ?? [],
                'rules' => $request->rules ?? [],
                'images' => $request->images ?? [],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Kostan created successfully',
                'data' => $kostan->load('owner:id,name')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create kostan',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Display the specified kostan (public)
     */
    public function show(Kostan $kostan): JsonResponse
    {
        try {
            if (!$kostan->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kostan not found'
                ], 404);
            }

            $kostan->load([
                'owner:id,name',
                'availableRooms',
                'publishedReviews.tenant:id,name'
            ]);

            return response()->json([
                'success' => true,
                'data' => $kostan
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve kostan',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Update the specified kostan (owner only)
     */
    public function update(Request $request, Kostan $kostan): JsonResponse
    {
        try {
            // Check ownership
            if ($kostan->owner_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to update this kostan'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|nullable|string',
                'address' => 'sometimes|string',
                'city' => 'sometimes|string|max:100',
                'province' => 'sometimes|string|max:100',
                'postal_code' => 'sometimes|nullable|string|max:10',
                'latitude' => 'sometimes|nullable|numeric|between:-90,90',
                'longitude' => 'sometimes|nullable|numeric|between:-180,180',
                'facilities' => 'sometimes|nullable|array',
                'rules' => 'sometimes|nullable|array',
                'images' => 'sometimes|nullable|array',
                'images.*' => 'string|url',
                'is_active' => 'sometimes|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $kostan->update($request->only([
                'name', 'description', 'address', 'city', 'province',
                'postal_code', 'latitude', 'longitude', 'facilities',
                'rules', 'images', 'is_active'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Kostan updated successfully',
                'data' => $kostan->load('owner:id,name')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update kostan',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Remove the specified kostan (owner only)
     */
    public function destroy(Request $request, Kostan $kostan): JsonResponse
    {
        try {
            // Check ownership
            if ($kostan->owner_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to delete this kostan'
                ], 403);
            }

            // Check if there are active rentals
            $hasActiveRentals = $kostan->rooms()
                ->whereHas('rentals', function($q) {
                    $q->where('status', 'active');
                })->exists();

            if ($hasActiveRentals) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete kostan with active rentals'
                ], 422);
            }

            $kostan->delete();

            return response()->json([
                'success' => true,
                'message' => 'Kostan deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete kostan',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Get kostans owned by authenticated user (owner only)
     */
    public function myKostans(Request $request): JsonResponse
    {
        try {
            $kostans = Kostan::with(['rooms' => function($q) {
                $q->where('is_active', true);
            }])
            ->where('owner_id', $request->user()->id)
            ->paginate($request->get('per_page', 10));

            return response()->json([
                'success' => true,
                'data' => $kostans
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve your kostans',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }
}
