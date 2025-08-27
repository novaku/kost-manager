<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Room;
use App\Models\Kostan;
use Illuminate\Support\Facades\Validator;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $kostanId = $request->route('kostan');
            $query = Room::with('kostan');

            if ($kostanId) {
                $query->where('kostan_id', $kostanId);
            }

            // Optional filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            if ($request->has('room_number')) {
                $query->where('room_number', 'like', '%' . $request->room_number . '%');
            }

            $rooms = $query->orderBy('room_number')->paginate($request->get('per_page', 15));

            return response()->json(['success' => true, 'data' => $rooms]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve rooms',
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
            $kostanId = $request->route('kostan');
            $kostan = Kostan::find($kostanId);
            if (!$user || !$kostan || $kostan->owner_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'room_number' => 'required|string|max:10',
                'monthly_price' => 'required|numeric|min:0',
                'max_occupancy' => 'required|integer|min:1',
                'status' => 'required|in:available,occupied,maintenance',
                'facilities' => 'nullable|array',
                'images' => 'nullable|array',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $room = Room::create([
                'kostan_id' => $kostan->id,
                'room_number' => $request->room_number,
                'monthly_price' => $request->monthly_price,
                'max_occupancy' => $request->max_occupancy,
                'status' => $request->status,
                'facilities' => $request->facilities ?? [],
                'images' => $request->images ?? [],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Room created',
                'data' => $room->load('kostan')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create room',
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
            $room = Room::with('kostan')->find($id);
            if (!$room) {
                return response()->json(['success' => false, 'message' => 'Room not found'], 404);
            }
            return response()->json(['success' => true, 'data' => $room]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve room',
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
    public function update(Request $request, $kostanId, $roomId): \Illuminate\Http\JsonResponse
    {
        try {
            $user = $request->user();
            $kostan = Kostan::find($kostanId);
            $room = Room::find($roomId);
            if (!$user || !$kostan || !$room || $kostan->owner_id !== $user->id || $room->kostan_id !== $kostan->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'room_number' => 'sometimes|string|max:10',
                'monthly_price' => 'sometimes|numeric|min:0',
                'max_occupancy' => 'sometimes|integer|min:1',
                'status' => 'sometimes|in:available,occupied,maintenance',
                'facilities' => 'sometimes|nullable|array',
                'images' => 'sometimes|nullable|array',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $room->update($request->only([
                'room_number', 'monthly_price', 'max_occupancy', 'status', 'facilities', 'images'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Room updated',
                'data' => $room->load('kostan')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update room',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($kostanId, $roomId): \Illuminate\Http\JsonResponse
    {
        try {
            $user = request()->user();
            $kostan = Kostan::find($kostanId);
            $room = Room::find($roomId);
            if (!$user || !$kostan || !$room || $kostan->owner_id !== $user->id || $room->kostan_id !== $kostan->id) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }

            $room->delete();

            return response()->json(['success' => true, 'message' => 'Room deleted']);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete room',
                'error' => config('app.debug') ? $e->getMessage() : 'Something went wrong'
            ], 500);
        }
    }
}
