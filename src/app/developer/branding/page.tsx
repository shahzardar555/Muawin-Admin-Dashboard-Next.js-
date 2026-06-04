'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Download, ExternalLink, Code } from 'lucide-react';
import MuawinIcon from '@/components/muawin/MuawinIcon';
import { useToast } from '@/hooks/use-toast';

export default function BrandingAssetsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const svgCode = `<svg width="512" height="512" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 52L50 10L88 52" stroke="#088771" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M24 50L50 22L76 50" stroke="#FFB800" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M32 50V74C32 80.6274 37.3726 86 44 86H56C62.6274 86 68 80.6274 68 74V50" stroke="#088771" stroke-width="10" stroke-linecap="round"/>
  <path d="M50 86V66" stroke="#088771" stroke-width="10" stroke-linecap="round"/>
</svg>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(svgCode);
    setCopied(true);
    toast({ title: "Code Copied!", description: "SVG source code is now on your clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface p-6 max-w-4xl mx-auto pb-24">
      <header className="py-8 flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-3xl font-black font-headline">Brand Assets</h1>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Logo & HD SVG Export</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="space-y-6">
          <h2 className="text-xl font-bold px-1">Visual Samples</h2>
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-8 bg-white border-none shadow-sm flex flex-col items-center gap-4 rounded-[32px]">
              <div className="w-24 h-24 text-primary">
                <MuawinIcon className="w-full h-full" />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">On White</p>
            </Card>
            <Card className="p-8 bg-primary border-none shadow-sm flex flex-col items-center gap-4 rounded-[32px]">
              <div className="w-24 h-24 text-white">
                <MuawinIcon className="w-full h-full" />
              </div>
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">On Primary</p>
            </Card>
          </div>

          <Card className="p-10 bg-white border-none shadow-xl rounded-[40px] flex flex-col items-center gap-8 text-center">
            <div className="w-48 h-48 text-primary shadow-2xl rounded-[48px] p-6 bg-surface flex items-center justify-center border-4 border-white">
              <MuawinIcon className="w-full h-full" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black">High Definition Logo</h3>
              <p className="text-sm text-muted-foreground leading-relaxed px-6">
                Our scalable vector logo supports both the Teal Outer Roof and the Golden Inner Roof for maximum brand recognition.
              </p>
            </div>
            <Button asChild className="rounded-2xl h-14 px-8 font-bold gap-3 shadow-lg shadow-primary/20">
              <a href="/muawin-logo-hd.svg" download="muawin-logo.svg">
                <Download className="w-5 h-5" /> Download SVG File
              </a>
            </Button>
          </Card>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-bold px-1 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            SVG Source Code
          </h2>
          <Card className="bg-slate-900 border-none shadow-2xl rounded-[32px] overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 bg-slate-800 border-b border-slate-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard}
                className="text-slate-400 hover:text-white hover:bg-slate-700 font-bold text-xs gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Code'}
              </Button>
            </div>
            <div className="p-6">
              <pre className="text-[11px] font-mono text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {svgCode}
              </pre>
            </div>
          </Card>

          <Card className="p-6 bg-white border-none shadow-sm space-y-4 rounded-[28px]">
            <h4 className="font-bold text-sm">Design Specifications</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-xs">
                <div className="w-4 h-4 bg-[#088771] rounded-sm" />
                <span className="font-medium">Primary Teal: <code>#088771</code></span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <div className="w-4 h-4 bg-[#FFB800] rounded-sm" />
                <span className="font-medium">Muawin Gold: <code>#FFB800</code></span>
              </li>
              <li className="flex items-center gap-3 text-xs">
                <div className="w-4 h-4 border border-slate-200 rounded-sm flex items-center justify-center text-[10px] font-bold">W</div>
                <span className="font-medium leading-tight text-muted-foreground">The wall structure forms a stylized 'W' for Work and Welcome.</span>
              </li>
            </ul>
          </Card>

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
            <ExternalLink className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
              <strong>Tip:</strong> SVGs are infinite resolution. To get a high-quality PNG, simply open the SVG in Chrome, right-click, and "Inspect", or use a free online converter.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
