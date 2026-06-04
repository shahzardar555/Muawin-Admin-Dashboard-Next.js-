'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Download, 
  Terminal, 
  Play, 
  FileCode, 
  Globe,
  Monitor,
  Package,
  Info,
  Sparkles,
  ChevronRight,
  CloudDownload
} from 'lucide-react';

/**
 * Developer Setup Guide Page.
 * Helps users identify how to download the project and run it locally.
 */
export default function DeveloperGuidePage() {
  const router = useRouter();

  const steps = [
    {
      title: "1. Locate Download Icon",
      description: "Look at the very top-right corner of the Firebase Studio header (the bar above this code editor). You will see a cloud icon with a downward arrow. Click it to package the code into a .zip file.",
      icon: CloudDownload,
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "2. Extract & Open",
      description: "Unzip the downloaded file on your computer and open the folder in VS Code or your preferred editor.",
      icon: Package,
      color: "text-purple-600 bg-purple-50"
    },
    {
      title: "3. Setup .env File",
      description: "Create a file named '.env' in the root folder and add your API key: GOOGLE_GENAI_API_KEY=your_key_here.",
      icon: Terminal,
      color: "text-amber-600 bg-amber-50"
    },
    {
      title: "4. Run Development Server",
      description: "Run 'npm install' then 'npm run dev'. Your local Muawin instance will be available at localhost:9002.",
      icon: Play,
      color: "text-green-600 bg-green-50"
    }
  ];

  return (
    <div className="min-h-screen bg-surface p-6 max-w-2xl mx-auto pb-20">
      <header className="py-8 flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-headline">Developer Setup Guide</h1>
          <p className="text-sm text-muted-foreground">How to export and run this project locally</p>
        </div>
      </header>

      <main className="space-y-8">
        <div className="bg-primary p-6 rounded-[32px] text-white space-y-4 shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <h2 className="text-xl font-black">Missing the Download Button?</h2>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              If you don't see the cloud icon in the top header, try expanding your browser window width. Sometimes it is tucked away inside the "..." (More) menu in the top bar.
            </p>
          </div>
          <Download className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-bold px-1">Getting the Source Code</h2>
          <div className="grid gap-4">
            {steps.map((step, i) => (
              <Card key={i} className="p-6 border-none shadow-sm flex gap-5 bg-white rounded-3xl">
                <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${step.color}`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold px-1">Assets & Branding</h2>
          <Card 
            onClick={() => router.push('/developer/branding')}
            className="p-6 border-none shadow-sm bg-white cursor-pointer hover:shadow-md transition-all group active:scale-[0.98] rounded-[32px]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight text-grey-900">Muawin HD Branding</h3>
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mt-1">Export SVG Logos</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-grey-300 group-hover:text-primary transition-transform" />
            </div>
          </Card>
        </section>

        <Card className="p-6 border-none bg-blue-50 space-y-3 rounded-[32px] border border-blue-100">
          <div className="flex items-center gap-2 text-blue-600">
            <Info className="w-5 h-5" />
            <h3 className="font-bold text-sm">Need help?</h3>
          </div>
          <p className="text-xs text-blue-800 leading-relaxed font-medium">
            The source code is structured using standard Next.js conventions. Look for <strong>src/app</strong> for routing, <strong>src/components</strong> for UI elements, and <strong>src/ai</strong> for AI flow definitions.
          </p>
        </Card>
      </main>
    </div>
  );
}
