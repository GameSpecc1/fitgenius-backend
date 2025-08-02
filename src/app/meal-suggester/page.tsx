"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UtensilsCrossed, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { suggestMeals } from "@/ai/flows/suggest-meals";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  dietaryPreferences: z.string().min(1, "Dietary preferences are required."),
  caloricNeeds: z.coerce.number().min(1, "Caloric needs must be a positive number."),
  macroGoals: z.string().min(1, "Macro goals are required."),
});

export default function MealSuggesterPage() {
  const [mealSuggestions, setMealSuggestions] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietaryPreferences: "",
      caloricNeeds: 2000,
      macroGoals: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setMealSuggestions(null);
    try {
      const result = await suggestMeals(values);
      setMealSuggestions(result.mealSuggestions);
    } catch (error) {
      console.error("Error suggesting meals:", error);
      setMealSuggestions(["Failed to get meal suggestions. Please try again."]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tighter font-headline text-primary">
          <UtensilsCrossed /> Meal Suggester
        </h1>
        <p className="text-muted-foreground">
          Let our AI help you find the perfect meals for your diet and goals.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Preferences</CardTitle>
            <CardDescription>
              Tell us about your diet so we can find meals you'll love.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="dietaryPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Preferences</FormLabel>
                      <Input placeholder="e.g., Vegetarian, low-carb" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="caloricNeeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Caloric Needs</FormLabel>
                      <Input type="number" placeholder="e.g., 2000" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="macroGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Macro Goals</FormLabel>
                      <Input placeholder="e.g., High protein, low fat" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Suggest Meals
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Meal Suggestions</CardTitle>
            <CardDescription>
              Here are some meal ideas based on your preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading && (
              <div className="space-y-3">
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-3/4 h-8" />
                <Skeleton className="w-full h-8" />
              </div>
            )}
            {mealSuggestions && (
              <ul className="p-4 space-y-2 list-disc list-inside rounded-lg bg-muted">
                {mealSuggestions.map((meal, index) => (
                  <li key={index} className="text-sm">{meal}</li>
                ))}
              </ul>
            )}
            {!mealSuggestions && !isLoading && (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <p>Fill in your details to get meal suggestions.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
