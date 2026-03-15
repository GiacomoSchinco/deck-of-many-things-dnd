"use client";

import { useState } from "react";
import React from "react";

import { Button as UI_Button } from "@/components/ui/button";
import {
  Card as UI_Card,
  CardHeader as UI_CardHeader,
  CardTitle as UI_CardTitle,
  CardContent as UI_CardContent,
  CardFooter as UI_CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { AntiqueButton } from '@/components/ui/custom/AntiqueButton';
import { Sword, Heart, Wand, Shield, Skull, Crown } from 'lucide-react';
import AncientCardContainer from "@/components/ui/custom/AncientCardContainer";
import CharacterCard from "@/components/ui/custom/CharacterCard";
import Loading from "@/components/ui/custom/Loading";

export default function TestUIPage() {
  const [text, setText] = useState("");
  const [checked, setChecked] = useState(false);
  const [radio, setRadio] = useState("a");
  const [switchOn, setSwitchOn] = useState(false);
  const [sliderVal, setSliderVal] = useState(30);
  const [progress, setProgress] = useState(40);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">UI Components Playground</h1>

      <div className="grid grid-cols-2 gap-4">
        <UI_Card>
          <UI_CardHeader>
            <UI_CardTitle>Form elements</UI_CardTitle>
          </UI_CardHeader>
          <UI_CardContent>
            <div className="space-y-3">
              <div>
                <Label>Nome</Label>
                <Input value={text} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)} placeholder="Inserisci nome" />
              </div>

              <div>
                <Label>Note</Label>
                <Textarea value={text} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)} />
              </div>

              <div>
                <Label>Razza</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Scegli una razza" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="human">Umano</SelectItem>
                    <SelectItem value="elf">Elfo</SelectItem>
                    <SelectItem value="dwarf">Nano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox checked={checked} onCheckedChange={(v: boolean) => setChecked(v)} />
                <span>Accetta termini</span>
              </div>

              <div>
                <RadioGroup value={radio} onValueChange={(v: string) => setRadio(v)}>
                  <div className="flex gap-2 items-center">
                    <RadioGroupItem value="a" />
                    <span>A</span>
                    <RadioGroupItem value="b" />
                    <span>B</span>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center gap-4">
                <Switch checked={switchOn} onCheckedChange={(v: boolean) => setSwitchOn(v)} />
                <span>{switchOn ? "On" : "Off"}</span>
              </div>

              <div>
                <Label>Slider: {sliderVal}</Label>
                <Slider value={[sliderVal]} onValueChange={(v: number | readonly number[]) => setSliderVal(Array.isArray(v) ? v[0] : v)} />
              </div>
            </div>
          </UI_CardContent>
          <UI_CardFooter>
            <UI_Button onClick={() => setProgress((p) => Math.min(100, p + 10))}>Aumenta Progress</UI_Button>
          </UI_CardFooter>
        </UI_Card>

        <div className="space-y-4">
          <Alert>Questo è un alert di esempio.</Alert>
          <Badge>Nuovo</Badge>
          <div className="w-full">
            <Progress value={progress} />
          </div>
          <Skeleton className="h-8 w-full" />

          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Contenuto 1</TabsContent>
            <TabsContent value="tab2">Contenuto 2</TabsContent>
          </Tabs>

          <Accordion>
            <AccordionItem value="item-1">
              <AccordionTrigger>Accordion item</AccordionTrigger>
              <AccordionContent>Dettagli dell&apos;accordion</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <Separator />

      <div className="flex gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger render={<UI_Button>Apri Menu</UI_Button>} />
          <DropdownMenuContent>
            <DropdownMenuItem>Opzione 1</DropdownMenuItem>
            <DropdownMenuItem>Opzione 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>Home</NavigationMenuItem>
            <NavigationMenuItem>Docs</NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <HoverCard>
          <HoverCardTrigger render={<UI_Button>Hover me</UI_Button>} />
          <HoverCardContent>Contenuto hover</HoverCardContent>
        </HoverCard>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={<UI_Button>Tooltip</UI_Button>} />
            <TooltipContent>Informazione</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog>
          <DialogTrigger render={<UI_Button>Apri Dialog</UI_Button>} />
          <DialogContent>
            <DialogTitle>Esempio Dialog</DialogTitle>
            <DialogDescription>Questo è il contenuto del dialog.</DialogDescription>
            <DialogFooter>
              <UI_Button>Chiudi</UI_Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet>
          <SheetTrigger render={<UI_Button>Apri Sheet</UI_Button>} />
          <SheetContent>Contenuto Sheet</SheetContent>
        </Sheet>

        <Drawer>
          <DrawerTrigger asChild><UI_Button>Apri Drawer</UI_Button></DrawerTrigger>
          <DrawerContent><DrawerTitle>Drawer di test</DrawerTitle><p>Contenuto Drawer</p></DrawerContent>
        </Drawer>
      </div>
          <div className="p-8 space-y-8">
      {/* Varianti colore */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif">Varianti Colore</h2>
        <div className="flex flex-wrap gap-4">
          <AntiqueButton variant="default">Default</AntiqueButton>
          <AntiqueButton variant="primary">Primary</AntiqueButton>
          <AntiqueButton variant="secondary">Secondary</AntiqueButton>
          <AntiqueButton variant="leather">Leather</AntiqueButton>
          <AntiqueButton variant="ancient">Ancient</AntiqueButton>
          <AntiqueButton variant="parchment">Parchment</AntiqueButton>
          <AntiqueButton variant="danger">Danger</AntiqueButton>
          <AntiqueButton variant="magic">Magic</AntiqueButton>
          <AntiqueButton variant="heal">Heal</AntiqueButton>
          <AntiqueButton variant="outline">Outline</AntiqueButton>
          <AntiqueButton variant="ghost">Ghost</AntiqueButton>
        </div>
      </div>

      {/* Dimensioni */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif">Dimensioni</h2>
        <div className="flex flex-wrap items-center gap-4">
          <AntiqueButton size="xs">XS</AntiqueButton>
          <AntiqueButton size="sm">SM</AntiqueButton>
          <AntiqueButton size="md">MD</AntiqueButton>
          <AntiqueButton size="lg">LG</AntiqueButton>
          <AntiqueButton size="xl">XL</AntiqueButton>
          <AntiqueButton size="fantasy-sm">Fantasy SM</AntiqueButton>
          <AntiqueButton size="fantasy-md">Fantasy MD</AntiqueButton>
          <AntiqueButton size="fantasy-lg">Fantasy LG</AntiqueButton>
        </div>
      </div>

      {/* Icone */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif">Con Icone</h2>
        <div className="flex flex-wrap gap-4">
          <AntiqueButton icon={<Sword />} variant="leather">
            Attacco
          </AntiqueButton>
          <AntiqueButton icon={<Heart />} variant="heal">
            Cura
          </AntiqueButton>
          <AntiqueButton icon={<Wand />} variant="magic" iconPosition="right">
            Incantesimo
          </AntiqueButton>
          <AntiqueButton icon={<Shield />} variant="primary" size="lg">
            Difesa
          </AntiqueButton>
          <AntiqueButton icon={<Skull />} variant="danger" size="fantasy-md">
            Morte
          </AntiqueButton>
          <AntiqueButton icon={<Crown />} variant="primary" size="xl">
            Corona
          </AntiqueButton>
        </div>
      </div>

      {/* Stati e effetti */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif">Stati</h2>
        <div className="flex flex-wrap gap-4">
          <AntiqueButton variant="primary" loading>
            Caricamento
          </AntiqueButton>
          <AntiqueButton variant="primary" disabled>
            Disabilitato
          </AntiqueButton>
          <AntiqueButton variant="primary" shine>
            Effetto Shine
          </AntiqueButton>
        </div>
      </div>

      {/* Arrotondamenti */}
      <AncientCardContainer haveMargin>
      <div className="space-y-4">
        <h2 className="text-2xl font-serif">Arrotondamenti</h2>
        <div className="flex flex-wrap gap-4">
          <AntiqueButton rounded="none" variant="leather">Nessuno</AntiqueButton>
          <AntiqueButton rounded="sm" variant="leather">Small</AntiqueButton>
          <AntiqueButton rounded="md" variant="leather">Medium</AntiqueButton>
          <AntiqueButton rounded="lg" variant="leather">Large</AntiqueButton>
          <AntiqueButton rounded="xl" variant="leather">XL</AntiqueButton>
          <AntiqueButton rounded="full" variant="leather">Full</AntiqueButton>
        </div>
      </div>
      </AncientCardContainer>
      {/* Esempio CharacterCard mock */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif">Esempio Scheda Personaggio (mock)</h2>
        <div className="flex flex-wrap gap-6">
          <CharacterCard
            id={1}
            name="Eldrin Willowshade"
            race="Elfo dei Boschi"
            characterClass="Ranger"
            level={5}
            background="Esploratore"
            alignment="Caotico Buono"
            image="/images/characters/eldrin.png"
            hp={28}
            maxhp={38}
            isFlippable
          />

          <CharacterCard
            id={2}
            name="Brunna Martelloferro"
            race="Nano delle Colline"
            characterClass="Fighter"
            level={7}
            background="Soldato"
            alignment="Legale Neutrale"
            image="/images/characters/brunna.png"
            hp={62}
            maxhp={78}
          />
        </div>
      </div>
    </div>
    <Loading />
  
    </div>
    
  );
}
