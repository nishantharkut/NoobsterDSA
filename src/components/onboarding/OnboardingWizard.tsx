
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProgrammingLanguage, UserProgress } from "@/types/learning";
import { Code, Target, Clock, BookOpen } from "lucide-react";

interface OnboardingWizardProps {
  onComplete: (userData: Partial<UserProgress>) => void;
}

const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<Partial<UserProgress>>({});

  const steps = [
    { title: "Welcome", icon: BookOpen },
    { title: "Language", icon: Code },
    { title: "Experience", icon: Target },
    { title: "Goals", icon: Target },
    { title: "Time", icon: Clock }
  ];

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({ ...userData, onboardingCompleted: true });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold">Welcome to your DSA journey!</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Let's personalize your learning experience to help you master Data Structures & Algorithms from zero to hero.
            </p>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Choose your programming language</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "python", name: "Python", desc: "Great for beginners, clean syntax" },
                { id: "javascript", name: "JavaScript", desc: "Popular for web development" },
                { id: "java", name: "Java", desc: "Industry standard, strongly typed" },
                { id: "cpp", name: "C++", desc: "High performance, competitive programming" }
              ].map((lang) => (
                <Card 
                  key={lang.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    userData.preferredLanguage === lang.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setUserData({...userData, preferredLanguage: lang.id as ProgrammingLanguage})}
                >
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold">{lang.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{lang.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">What's your programming experience?</h2>
            <div className="space-y-3">
              {[
                { id: "complete-beginner", title: "Complete Beginner", desc: "New to programming" },
                { id: "some-programming", title: "Some Programming", desc: "Know basics but new to DSA" },
                { id: "know-basics", title: "Know Programming Basics", desc: "Comfortable with coding, new to DSA" }
              ].map((level) => (
                <Card 
                  key={level.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    userData.experienceLevel === level.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setUserData({...userData, experienceLevel: level.id as any})}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{level.title}</h3>
                    <p className="text-sm text-muted-foreground">{level.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">What's your learning goal?</h2>
            <div className="space-y-3">
              {[
                { id: "interviews", title: "Coding Interviews", desc: "Prepare for technical interviews" },
                { id: "academic", title: "Academic Course", desc: "Support university studies" },
                { id: "personal", title: "Personal Growth", desc: "Learn for personal development" }
              ].map((goal) => (
                <Card 
                  key={goal.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    userData.learningGoal === goal.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setUserData({...userData, learningGoal: goal.id as any})}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">{goal.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">How much time can you dedicate daily?</h2>
            <div className="space-y-3">
              {[
                { id: 15, title: "15 minutes", desc: "Perfect for busy schedules" },
                { id: 30, title: "30 minutes", desc: "Recommended for steady progress" },
                { id: 60, title: "1 hour", desc: "Intensive learning mode" }
              ].map((time) => (
                <Card 
                  key={time.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    userData.timeCommitment === time.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setUserData({...userData, timeCommitment: time.id as any})}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{time.title}</h3>
                    <p className="text-sm text-muted-foreground">{time.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return userData.preferredLanguage;
      case 2: return userData.experienceLevel;
      case 3: return userData.learningGoal;
      case 4: return userData.timeCommitment;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200'
                    }`}>
                      {index < currentStep ? '✓' : <StepIcon className="w-4 h-4" />}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-1 mx-2 ${
                        index < currentStep ? 'bg-primary' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <Progress value={progressPercentage} className="mb-4" />
          <CardTitle className="text-center">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}
          
          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!canProceed()}
              className="px-8"
            >
              {currentStep === steps.length - 1 ? 'Start Learning!' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingWizard;
