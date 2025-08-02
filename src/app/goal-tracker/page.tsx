"use client";

import { useState } from "react";
import { PlusCircle, Goal as GoalIcon, Edit, Trash2 } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

// TODO: Replace with actual user ID
const FAKE_USER_ID = "user_id_123";

export default function GoalTrackerPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [unit, setUnit] = useState("");
  const { toast } = useToast();

  const resetForm = () => {
    setTitle("");
    setTarget("");
    setCurrent("");
    setUnit("");
    setEditingGoal(null);
  };

  const handleOpenDialog = (goal: Goal | null = null) => {
    if (goal) {
      setEditingGoal(goal);
      setTitle(goal.title);
      setTarget(String(goal.target));
      setCurrent(String(goal.current));
      setUnit(goal.unit);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSaveGoal = () => {
    if (!title || !target || !current || !unit) {
        toast({ title: "Missing fields", description: "Please fill out all fields.", variant: "destructive" });
        return;
    };

    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal.id ? { ...g, title, target: +target, current: +current, unit } : g));
      toast({ title: "Goal Updated", description: "Your goal has been successfully updated." });
    } else {
      const newGoal: Goal = {
        id: new Date().toISOString(),
        title,
        target: +target,
        current: +current,
        unit,
      };
      setGoals([newGoal, ...goals]);
      toast({ title: "Goal Set", description: "Your new goal has been successfully set." });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
    toast({ title: "Goal Deleted", description: "Your goal has been deleted." });
  };
  
  return (
    <div className="space-y-8">
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="flex items-center justify-between">
        <header className="space-y-2">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tighter font-headline text-primary">
            <GoalIcon /> Goal Tracker
          </h1>
          <p className="text-muted-foreground">Set and track your fitness goals to stay motivated.</p>
        </header>
        <DialogTrigger asChild>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Set New Goal
          </Button>
        </DialogTrigger>
      </div>

     
        <DialogContent onInteractOutside={() => resetForm()} onEscapeKeyDown={() => resetForm()}>
          <DialogHeader>
            <DialogTitle>{editingGoal ? 'Edit Goal' : 'Set a New Goal'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4"><Label htmlFor="title" className="text-right">Title</Label><Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" placeholder="e.g., Lose Weight" /></div>
            <div className="grid items-center grid-cols-4 gap-4"><Label htmlFor="current" className="text-right">Current</Label><Input id="current" value={current} onChange={(e) => setCurrent(e.target.value)} type="number" className="col-span-3" placeholder="e.g., 85" /></div>
            <div className="grid items-center grid-cols-4 gap-4"><Label htmlFor="target" className="text-right">Target</Label><Input id="target" value={target} onChange={(e) => setTarget(e.target.value)} type="number" className="col-span-3" placeholder="e.g., 80" /></div>
            <div className="grid items-center grid-cols-4 gap-4"><Label htmlFor="unit" className="text-right">Unit</Label><Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} className="col-span-3" placeholder="e.g., kg" /></div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" onClick={resetForm}>Cancel</Button></DialogClose>
            <Button onClick={handleSaveGoal}>Save Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>No Goals Set Yet</CardTitle>
              <CardDescription>Click "Set New Goal" to add your first fitness objective.</CardDescription>
            </CardHeader>
            <GoalIcon className="w-16 h-16 text-muted-foreground" />
          </Card>
        ) : (
          goals.map((goal) => (
            <Card key={goal.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{goal.title}</CardTitle>
                <CardDescription>{`Target: ${goal.target} ${goal.unit}`}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <Progress value={(goal.current / goal.target) * 100} />
                <p className="text-sm text-center text-muted-foreground">{`${goal.current} / ${goal.target} ${goal.unit}`}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(goal)}><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteGoal(goal.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
