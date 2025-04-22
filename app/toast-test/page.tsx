"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function ToastTestPage() {
  const [count, setCount] = useState(0);

  const showSuccessToast = () => {
    toast({
      title: "Success!",
      description: "This is a success toast notification",
      variant: "success",
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Error!",
      description: "This is an error toast notification",
      variant: "destructive",
    });
  };

  const showInfoToast = () => {
    toast({
      title: "Information",
      description: "This is an informational toast notification",
    });
  };

  const showCountToast = () => {
    setCount(prev => prev + 1);
    toast({
      title: `Counter: ${count + 1}`,
      description: "The counter has been incremented",
    });
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Toast Notification Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button onClick={showSuccessToast} variant="default">
          Show Success Toast
        </Button>
        
        <Button onClick={showErrorToast} variant="destructive">
          Show Error Toast
        </Button>
        
        <Button onClick={showInfoToast} variant="secondary">
          Show Info Toast
        </Button>
        
        <Button onClick={showCountToast} variant="outline">
          Counter: {count}
        </Button>
      </div>
    </div>
  );
} 