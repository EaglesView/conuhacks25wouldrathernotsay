"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"; // Ensure Carousel is properly set up

const hats = [
  "hat1.png",
  "hat2.png",
  "hat3.png",
]; // Replace with actual image paths

interface HatSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: () => void;
}

const HatSelectionDialog = ({ isOpen, onClose, onStartGame }: HatSelectionDialogProps) => {
  const [selectedHat, setSelectedHat] = useState<string>(hats[0]);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md flex justify-center items-center flex-col">
        <DialogHeader>
          <DialogTitle>Select Your Hat</DialogTitle>
        </DialogHeader>

        {/* Hat Selection Carousel */}
        <Carousel className="w-[80%]">
          <CarouselContent>
            {hats.map((hat, index) => (
              <CarouselItem key={index} className="flex justify-center">
                <img
                  src={hat}
                  alt={`Hat ${index + 1}`}
                  className={`w-24 h-24 cursor-pointer rounded-lg ${
                    selectedHat === hat ? "bg-black/20" : "bg-none"
                  }`}
                  onClick={() => setSelectedHat(hat)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {/* Terms and Conditions Checkbox */}
        <div className="flex items-center gap-2 mt-4">
          <Checkbox id="terms" checked={isChecked} onCheckedChange={setIsChecked} />
          <label htmlFor="terms" className="text-sm">
            I have read and agree to the terms & conditions.
          </label>
        </div>

        {/* Play Now Button */}
        <Button
          onClick={() => {
            onStartGame();
            onClose();
          }}
          disabled={!isChecked}
          className="w-full mt-4"
        >
          Play Now
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default HatSelectionDialog;
