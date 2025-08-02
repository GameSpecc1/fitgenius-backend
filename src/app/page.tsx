import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BotMessageSquare,
  Calculator,
  Camera,
  Dumbbell,
  Goal,
  NotebookText,
  UtensilsCrossed,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const features: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    title: 'Fitness Chatbot',
    description: 'Get real-time, personalized fitness advice from our AI chatbot.',
    href: '/chatbot',
    icon: BotMessageSquare,
  },
  {
    title: 'Workout Generator',
    description: 'Create personalized workout plans tailored to your goals.',
    href: '/workout-generator',
    icon: Dumbbell,
  },
  {
    title: 'Workout Tracker',
    description: 'Log your workouts and track your progress over time.',
    href: '/workout-tracker',
    icon: NotebookText,
  },
  {
    title: 'Meal Suggestions',
    description: 'Discover healthy meal ideas that fit your dietary needs.',
    href: '/meal-suggester',
    icon: UtensilsCrossed,
  },
  {
    title: 'Goal Tracker',
    description: 'Set your fitness goals and monitor your achievements.',
    href: '/goal-tracker',
    icon: Goal,
  },
  {
    title: 'Macro Tracker',
    description: 'Get personalized macro recommendations for your diet.',
    href: '/macro-tracker',
    icon: Calculator,
  },
  {
    title: 'Equipment Identifier',
    description: 'Identify gym equipment from a photo and get a tutorial.',
    href: '/equipment-identifier',
    icon: Camera,
  },
];

export default function Home() {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter text-primary font-headline">
          Welcome to FitGenius
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Your all-in-one AI-powered fitness partner. Select a feature below to get started on your
          journey to a healthier you.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.href} className="group">
            <Card className="flex flex-col h-full transition-all duration-300 border-2 border-border group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20">
              <CardHeader className="flex flex-row items-center gap-4">
                <feature.icon className="w-8 h-8 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
