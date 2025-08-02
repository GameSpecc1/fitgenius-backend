"use client";

import { useState } from "react";
import { PlusCircle, NotebookText, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";

interface Workout {
  id: string;
  date: Date;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
}

// TODO: Replace with actual data fetching and mutations from Data Connect
const FAKE_USER_ID = 'user_id_123';

export default function WorkoutTrackerPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const { toast } = useToast();

  const resetForm = () => {
    setExercise("");
    setSets("");
    setReps("");
    setWeight("");
    setEditingWorkout(null);
  }

  const handleOpenDialog = (workout: Workout | null = null) => {
    if (workout) {
      setEditingWorkout(workout);
      setExercise(workout.exercise);
      setSets(String(workout.sets));
      setReps(String(workout.reps));
      setWeight(String(workout.weight));
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSaveWorkout = () => {
    if (!exercise || !sets || !reps || !weight) {
        toast({ title: "Missing fields", description: "Please fill out all fields.", variant: "destructive" });
        return;
    };

    if (editingWorkout) {
      setWorkouts(workouts.map(w => w.id === editingWorkout.id ? { ...w, exercise, sets: +sets, reps: +reps, weight: +weight } : w));
      toast({ title: "Workout Updated", description: "Your workout has been successfully updated." });
    } else {
        const newWorkout: Workout = {
            id: new Date().toISOString(),
            date: new Date(),
            exercise,
            sets: parseInt(sets),
            reps: parseInt(reps),
            weight: parseInt(weight),
          };
          setWorkouts([newWorkout, ...workouts]);
          toast({ title: "Workout Logged", description: "Your new workout has been successfully logged." });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id));
    toast({ title: "Workout Deleted", description: "Your workout has been deleted." });
  }

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
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Log Workout
            </Button>
          </DialogTrigger>
         
      </div>
       <DialogContent onInteractOutside={resetForm} onEscapeKeyDown={resetForm}>
            <DialogHeader>
              <DialogTitle>{editingWorkout ? 'Edit Workout' : 'Log a New Workout'}</DialogTitle>
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
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleSaveWorkout}>Save Workout</Button>
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
              <CardFooter className="justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(workout)}><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteWorkout(workout.id)}><Trash2 className="w-4 h-4" /></Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
