'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Globe, Linkedin, Twitter, Youtube, Facebook, Instagram } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import { DatePickerWithRange } from "@/components/stages/ccba/details/scraps-tab/social/DatePickerwithRange";
import { DateRange } from 'react-day-picker';

// Helper for social inputs with built-in icon support
export function SocialInput({ icon: Icon, label, register, placeholder }: { icon: any, label: string, register: any, placeholder: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        icon={<Icon className="w-4 h-4" />}
        className="h-10"
        {...register}
        placeholder={placeholder}
      />
    </div>
  )
}

export function CompetitorSection({ form }: { form: any }) {
  const competitors = form.watch('competitors');

  const addCompetitor = () => {
    const current = form.getValues('competitors');
    form.setValue('competitors', [
      ...current,
      { id: crypto.randomUUID(), name: '', website: '', socials: {} }
    ]);
  };

  const removeCompetitor = (index: number) => {
    const current = form.getValues('competitors');
    form.setValue('competitors', current.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-medium mb-2">Competitive Frame</h2>
        <p className="text-muted-foreground">Add competitors to analyze against the client.</p>
      </div>

      <div className="grid gap-6">
        {competitors.map((comp: any, index: number) => (
          <div key={comp.id} className="relative p-6 border rounded-xl bg-accent transition-colors">
            <Button
              type="button"
              variant="ghost"
              className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"
              onClick={() => removeCompetitor(index)}
            >
             Remove
            </Button>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label className="text-base">Competitor Name</Label>
                <Input className="h-11" {...form.register(`competitors.${index}.name`)} placeholder="Name" />
              </div>
              <div className="space-y-2">
                <Label className="text-base">Website URL</Label>
                <Input
                  icon={<Globe className="w-4 h-4" />}
                  className="h-11"
                  {...form.register(`competitors.${index}.website`)}
                  placeholder="https://"
                />
              </div>
            </div>

            <div>
              <Label className="text-base mb-3">Social Channels</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <SocialInput icon={Linkedin} label="LinkedIn" register={form.register(`competitors.${index}.socials.linkedin`)} placeholder="company/..." />
                <SocialInput icon={Twitter} label="Twitter/X" register={form.register(`competitors.${index}.socials.twitter`)} placeholder="@handle" />
                <SocialInput icon={Instagram} label="Instagram" register={form.register(`competitors.${index}.socials.instagram`)} placeholder="@handle" />
                <SocialInput icon={Youtube} label="YouTube" register={form.register(`competitors.${index}.socials.youtube`)} placeholder="@channel" />
                <SocialInput icon={Facebook} label="Facebook" register={form.register(`competitors.${index}.socials.facebook`)} placeholder="page-url" />
                <SocialInput icon={FaTiktok} label="TikTok" register={form.register(`competitors.${index}.socials.tiktok`)} placeholder="@handle" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {competitors.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
          No competitors added yet.
        </div>
      )}

      <Button type="button" variant="secondary" onClick={addCompetitor} className="w-full h-14 border-dashed border-2 bg-transparent hover:bg-accent">
        <Plus className=" h-5 w-5" /> Add Competitor
      </Button>
    </div>
  );
}

export function ChannelSection({ form, socialDateRange, setSocialDateRange }: { form: any, socialDateRange: DateRange | undefined, setSocialDateRange: any }) {

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-medium mb-2">Channels & Scope</h2>
        <p className="text-muted-foreground">Configure the data collection depth and sources.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Website Config */}
        <div className="space-y-4 border p-6 rounded-xl bg-accent">
          <div className="flex items-center gap-2 mb-2">
            <h3 className=" text-lg">Website Capture Config</h3>
          </div>
          <div className="space-y-2">
            <Label>Max Pages to Capture</Label>
            <Input
              type="number"
              placeholder="10"
              className="h-11 text-lg"
              {...form.register('scrapeSettings.webLimit', { valueAsNumber: true })}
              defaultValue={10}
            />  
            <p className="text-xs text-muted-foreground">Number of pages to crawl per website (Client & Competitors).</p>
          </div>
        </div>

        {/* Social Config */}
        <div className="space-y-4 border p-6 rounded-xl bg-accent">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg">Social Capture Config</h3>
          </div>
          <div className="space-y-2">
            <Label>Social Date Range</Label>
            <DatePickerWithRange date={socialDateRange} setDate={setSocialDateRange} />
            <p className="text-xs text-muted-foreground">Select the start and end date for historical data collection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
