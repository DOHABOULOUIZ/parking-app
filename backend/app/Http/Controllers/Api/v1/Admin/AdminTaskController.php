<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Http\Resources\TaskResource;
use Illuminate\Http\Request;

class AdminTaskController extends Controller
{
    /**
     * Get all tasks with filtering
     */
    public function index(Request $request)
    {
        $query = Task::with('assignee', 'creator');

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->priority) {
            $query->where('priority', $request->priority);
        }

        if ($request->assigned_to) {
            $query->where('assigned_to', $request->assigned_to);
        }

        $tasks = $query->orderBy('due_date', 'asc')
                       ->orderBy('priority', 'desc')
                       ->paginate(15);

        return response()->json([
            'data' => TaskResource::collection($tasks->items()),
            'meta' => [
                'total' => $tasks->total(),
                'per_page' => $tasks->perPage(),
                'current_page' => $tasks->currentPage(),
                'last_page' => $tasks->lastPage()
            ]
        ]);
    }

    /**
     * Create a new task
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
            'priority' => 'required|in:low,medium,high',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        $validated['created_by'] = $request->user()->id;

        $task = Task::create($validated);
        $task->load('assignee', 'creator');

        return response()->json([
            'message' => 'Tâche créée avec succès',
            'data' => TaskResource::make($task)
        ], 201);
    }

    /**
     * Get a single task
     */
    public function show(Task $task)
    {
        $task->load('assignee', 'creator');

        return response()->json([
            'data' => TaskResource::make($task)
        ]);
    }

    /**
     * Update a task
     */
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:pending,in_progress,completed,cancelled',
            'priority' => 'in:low,medium,high',
            'assigned_to' => 'nullable|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);
        $task->load('assignee', 'creator');

        return response()->json([
            'message' => 'Tâche mise à jour avec succès',
            'data' => TaskResource::make($task)
        ]);
    }

    /**
     * Delete a task
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json([
            'message' => 'Tâche supprimée avec succès'
        ]);
    }

    /**
     * Get task statistics
     */
    public function statistics()
    {
        return response()->json([
            'data' => [
                'total' => Task::count(),
                'pending' => Task::where('status', 'pending')->count(),
                'in_progress' => Task::where('status', 'in_progress')->count(),
                'completed' => Task::where('status', 'completed')->count(),
                'cancelled' => Task::where('status', 'cancelled')->count(),
                'high_priority' => Task::where('priority', 'high')->count(),
                'medium_priority' => Task::where('priority', 'medium')->count(),
                'low_priority' => Task::where('priority', 'low')->count(),
            ]
        ]);
    }
}
