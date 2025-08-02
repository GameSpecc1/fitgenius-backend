
"use client";

import { useState, useRef } from "react";
import { Camera, Upload, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { identifyEquipment, type IdentifyEquipmentOutput } from "@/ai/flows/identify-equipment";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function EquipmentIdentifierPage() {
  // TODO: Replace with actual user subscription status
  const [isPro, setIsPro] = useState(false);

  const [result, setResult] = useState<IdentifyEquipmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (e.g., JPG, PNG).",
        variant: "destructive",
      });
      return;
    }
    
    setResult(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      handleIdentify(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleIdentify = async (dataUri: string) => {
    setIsLoading(true);
    try {
      const response = await identifyEquipment({ photoDataUri: dataUri });
      setResult(response);
    } catch (error) {
      console.error("Error identifying equipment:", error);
      toast({
        title: "Identification Failed",
        description: "Could not identify the equipment. Please try another image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  if (!isPro) {
    return (
        <div className="space-y-8">
            <header className="space-y-2">
                <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tighter font-headline text-primary">
                <Camera /> Equipment Identifier
                </h1>
                <p className="text-muted-foreground">Upload a picture of gym equipment to learn what it is and how to use it.</p>
            </header>
            <Card className="flex flex-col items-center justify-center p-12 text-center">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                        <Sparkles className="text-primary" />
                        This is a Pro Feature
                    </CardTitle>
                    <CardDescription>Upgrade to FitGenius Pro to unlock the Equipment Identifier and other exclusive features.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/billing">
                        <Button>Upgrade to Pro</Button>
                    </Link>
                </CardContent>
            </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tighter font-headline text-primary">
          <Camera /> Equipment Identifier
        </h1>
        <p className="text-muted-foreground">Upload a picture of gym equipment to learn what it is and how to use it.</p>
      </header>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label
              htmlFor="equipment-upload"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={cn(
                "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer border-border hover:bg-muted transition-colors",
                isDragging && "border-primary bg-muted"
              )}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
              </div>
              <input
                id="equipment-upload"
                type="file"
                className="hidden"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
              />
            </label>
            {preview && (
              <div className="relative w-full overflow-hidden rounded-lg aspect-video">
                <Image src={preview} alt="Equipment preview" layout="fill" objectFit="cover" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
            <CardDescription>The equipment name and tutorial will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="w-1/2 h-8" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            )}
            {result && !isLoading && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-primary">{result.name}</h2>
                <div className="p-4 rounded-lg bg-muted">
                  <h3 className="mb-2 font-semibold">How to Use:</h3>
                  <p className="text-sm whitespace-pre-wrap text-muted-foreground font-body">{result.tutorial}</p>
                </div>
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <p>Upload an image to begin identification.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
