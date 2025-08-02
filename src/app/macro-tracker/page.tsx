"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calculator, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateMacroRecommendations, type MacroRecommendationsOutput } from "@/ai/flows/generate-macro-recommendations";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  weight: z.coerce.number().positive(),
  height: z.coerce.number().positive(),
  age: z.coerce.number().positive().int(),
  gender: z.string().min(1),
  bodyFat: z.coerce.number().optional(),
  activityLevel: z.string().min(1),
  fitnessGoals: z.string().min(1),
});

export default function MacroTrackerPage() {
  const [recommendations, setRecommendations] = useState<MacroRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { gender: "male", activityLevel: "moderately_active", fitnessGoals: "fat_loss" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const bodyComposition = `Weight: ${values.weight}kg, Height: ${values.height}cm, Age: ${values.age}, Gender: ${values.gender}${values.bodyFat ? `, Body Fat: ${values.bodyFat}%` : ''}`;
      const result = await generateMacroRecommendations({
        bodyComposition,
        activityLevel: values.activityLevel,
        fitnessGoals: values.fitnessGoals,
      });
      setRecommendations(result);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setRecommendations({ protein: 'N/A', carbs: 'N/A', fats: 'N/A', calories: 'N/A', notes: 'Failed to generate recommendations. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tighter font-headline text-primary">
          <Calculator /> Macro Calculator
        </h1>
        <p className="text-muted-foreground">Get personalized macronutrient and calorie recommendations from our AI.</p>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Your Details</CardTitle></CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="weight" render={({ field }) => (<FormItem><FormLabel>Weight (kg)</FormLabel><Input type="number" {...field} /><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="height" render={({ field }) => (<FormItem><FormLabel>Height (cm)</FormLabel><Input type="number" {...field} /><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>Age</FormLabel><Input type="number" {...field} /><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="bodyFat" render={({ field }) => (<FormItem><FormLabel>Body Fat % (Optional)</FormLabel><Input type="number" {...field} /><FormMessage /></FormItem>)} />
                </div>
                <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="activityLevel" render={({ field }) => (<FormItem><FormLabel>Activity Level</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="sedentary">Sedentary</SelectItem><SelectItem value="lightly_active">Lightly Active</SelectItem><SelectItem value="moderately_active">Moderately Active</SelectItem><SelectItem value="very_active">Very Active</SelectItem><SelectItem value="extra_active">Extra Active</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="fitnessGoals" render={({ field }) => (<FormItem><FormLabel>Fitness Goal</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="fat_loss">Fat Loss</SelectItem><SelectItem value="muscle_growth">Muscle Growth</SelectItem><SelectItem value="maintenance">Maintenance</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <Button type="submit" disabled={isLoading} className="w-full">{isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Calculate Macros</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <div className="space-y-8">
          <Card className="text-center">
            <CardHeader><CardTitle className="text-primary">Daily Calories</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="w-32 h-12 mx-auto" /> : <p className="text-5xl font-bold">{recommendations?.calories || "..."}</p>}
              <p className="text-muted-foreground">kcal</p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-3 gap-4">
            {['protein', 'carbs', 'fats'].map(macro => (
              <Card key={macro} className="text-center">
                <CardHeader><CardTitle className="capitalize">{macro}</CardTitle></CardHeader>
                <CardContent>
                  {isLoading ? <Skeleton className="w-20 h-8 mx-auto" /> : <p className="text-3xl font-bold">{recommendations?.[macro as keyof MacroRecommendationsOutput] || "..."}</p>}
                  <p className="text-muted-foreground">grams</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader><CardTitle>Notes from AI Coach</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? <div className="space-y-2"><Skeleton className="h-4" /><Skeleton className="w-5/6 h-4" /></div> : <p className="text-sm text-muted-foreground">{recommendations?.notes || "Your notes will appear here."}</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
