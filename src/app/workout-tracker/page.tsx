"use client";

import { useState } from "react";
import { PlusCircle, NotebookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface Workout {
  id: string;
  date: Date;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
}

export default function WorkoutTrackerPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const handleAddWorkout = () => {
    if (!exercise || !sets || !reps || !weight) return;

    const newWorkout: Workout = {
      id: new Date().toISOString(),
      date: new Date(),
      exercise,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: parseInt(weight),
    };
    setWorkouts([newWorkout, ...workouts]);
    
    // Reset form and close dialog
    setExercise("");
    setSets("");
    setReps("");
    setWeight("");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-8">
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="flex items-center justify-between">
        <header className="space-y-2">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tighter font-headline text-primary">
            <NotebookText /> Workout Tracker
          </h1>
          <p className="text-muted-foreground">Log your workouts to keep track of your progress.</p>
        </header>

       
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Log Workout
            </Button>
          </DialogTrigger>
         
      </div>
       <DialogContent>
            <DialogHeader>
              <DialogTitle>Log a New Workout</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="exercise" className="text-right">Exercise</Label>
                <Input id="exercise" value={exercise} onChange={(e) => setExercise(e.target.value)} className="col-span-3" placeholder="e.g., Bench Press" />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="sets" className="text-right">Sets</Label>
                <Input id="sets" value={sets} onChange={(e) => setSets(e.target.value)} type="number" className="col-span-3" placeholder="e.g., 3" />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="reps" className="text-right">Reps</Label>
                <Input id="reps" value={reps} onChange={(e) => setReps(e.target.value)} type="number" className="col-span-3" placeholder="e.g., 10" />
              </div>
              <div className="grid items-center grid-cols-4 gap-4">
                <Label htmlFor="weight" className="text-right">Weight (kg)</Label>
                <Input id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} type="number" className="col-span-3" placeholder="e.g., 60" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddWorkout}>Save Workout</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      <div className="space-y-4">
        {workouts.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <CardHeader>
              <CardTitle>No Workouts Logged Yet</CardTitle>
              <CardDescription>Click "Log Workout" to add your first entry and start tracking your gains!</CardDescription>
            </CardHeader>
            <NotebookText className="w-16 h-16 text-muted-foreground" />
          </Card>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle>{workout.exercise}</CardTitle>
                <CardDescription>{format(workout.date, "PPP")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Sets</p>
                    <p className="text-2xl font-bold">{workout.sets}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reps</p>
                    <p className="text-2xl font-bold">{workout.reps}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="text-2xl font-bold">{workout.weight} kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
