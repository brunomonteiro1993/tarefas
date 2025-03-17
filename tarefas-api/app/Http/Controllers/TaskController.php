<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
 
    public function index()
    {
        return response()->json(Task::orderBy('is_favorite', 'desc')->get());
    }

 
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'is_favorite' => 'boolean',
        ]);

        $task = Task::create($request->all());

        return response()->json($task, 201);
    }


    public function show($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Tarefa não encontrada'], 404);
        }

        return response()->json($task);
    }


    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $task->update($request->all());
        return response()->json($task);
    }
    
 
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(['message' => 'Tarefa removida com sucesso!'], 200);
    }
}
