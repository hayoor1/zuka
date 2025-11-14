'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface SignupAnimationProps {
  onComplete: () => void;
  steps: string[];
}

export function SignupAnimation({ onComplete, steps }: SignupAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, currentStep]);
        setCurrentStep(prev => prev + 1);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      // All steps completed, wait a bit then call onComplete
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, steps.length, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#fbf8ff] via-[#fffdf7] to-[#fbf8ff]">
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-4 bg-brand-gold-gradient rounded-full mb-4 animate-pulse-glow">
            <Sparkles className="h-12 w-12 text-brand-purple animate-sparkle" />
          </div>
          <h1 className="text-3xl font-bold text-brand-purple mb-2">
            Setting Up Your Account
          </h1>
          <p className="text-brand-purple/70">
            Just a moment...
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index && !isCompleted;
            const isPending = index > currentStep;

            return (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all duration-500 ${
                  isCompleted
                    ? 'bg-green-50 border-green-200'
                    : isCurrent
                    ? 'bg-brand-gold/10 border-brand-gold animate-pulse'
                    : 'bg-white border-gray-200 opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Step Number/Check */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCompleted
                      ? 'bg-green-500 text-white scale-100'
                      : isCurrent
                      ? 'bg-brand-gold-gradient text-brand-purple scale-110 animate-scale-pulse'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6 animate-scale-pulse" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>

                  {/* Step Text */}
                  <div className="flex-1">
                    <p className={`font-medium transition-colors ${
                      isCompleted
                        ? 'text-green-700'
                        : isCurrent
                        ? 'text-brand-purple'
                        : 'text-gray-400'
                    }`}>
                      {step}
                    </p>
                  </div>

                  {/* Loading Indicator */}
                  {isCurrent && (
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Arrow */}
                  {isCompleted && index < steps.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-green-500 animate-fade-in" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-gradient transition-all duration-500 ease-out"
              style={{
                width: `${(completedSteps.length / steps.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-center text-sm text-brand-purple/70 mt-2">
            {completedSteps.length} of {steps.length} steps completed
          </p>
        </div>
      </div>
    </div>
  );
}

