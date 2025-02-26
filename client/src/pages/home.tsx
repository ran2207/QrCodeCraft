import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertQrCodeSchema, type InsertQrCode } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ERROR_CORRECTION_LEVELS, SIZE_OPTIONS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { Download, Copy } from "lucide-react";
import QRCodeStyling from "qr-code-styling";

const dotTypes = [
  { value: "square", label: "Square" },
  { value: "dots", label: "Dots" },
  { value: "rounded", label: "Rounded" },
  { value: "classy", label: "Classy" },
  { value: "extra-rounded", label: "Extra Rounded" },
];

const cornerSquareTypes = [
  { value: "square", label: "Square" },
  { value: "extra-rounded", label: "Extra Rounded" },
  { value: "dot", label: "Dot" },
];

export default function Home() {
  const { toast } = useToast();
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrCode] = useState(new QRCodeStyling({
    width: 300,
    height: 300,
    margin: 10,
    type: 'svg',
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'Q'
    },
    dotsOptions: {
      type: 'square',
      color: '#000000'
    },
    backgroundOptions: {
      color: '#FFFFFF',
    },
    cornersSquareOptions: {
      type: 'square',
      color: '#000000'
    },
    cornersDotOptions: {
      type: 'dot',
      color: '#000000'
    },
  }));

  const form = useForm<InsertQrCode>({
    resolver: zodResolver(insertQrCodeSchema),
    defaultValues: {
      content: "",
      contentType: "text",
      size: 300,
      errorCorrection: "Q",
      style: "square",
      fgColor: "#000000",
      bgColor: "#FFFFFF",
    },
  });

  const { content, size, errorCorrection, style, fgColor, bgColor } = form.watch();

  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);
    }
  }, [qrCode]);

  useEffect(() => {
    if (!content) return;
    qrCode.update({
      data: content,
      dotsOptions: {
        type: style as any,
        color: fgColor
      },
      backgroundOptions: {
        color: bgColor
      },
      width: size,
      height: size,
      qrOptions: {
        errorCorrectionLevel: errorCorrection as any
      }
    });
  }, [content, style, fgColor, bgColor, size, errorCorrection]);

  const handleDownload = () => {
    if (!content) return;
    qrCode.download({
      extension: 'png'
    });
    toast({
      title: "QR Code Downloaded",
      description: "Your QR code has been downloaded successfully.",
    });
  };

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Content Copied",
        description: "QR code content has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">QR Code Generator</h1>
          <p className="text-muted-foreground">
            Generate custom QR codes with various options
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter text or URL" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dots Style</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dotTypes.map((type) => (
                              <SelectItem
                                key={type.value}
                                value={type.value}
                              >
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fgColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Foreground Color</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input 
                                type="color" 
                                {...field}
                                className="w-12 h-9 p-1 cursor-pointer"
                              />
                              <Input 
                                type="text" 
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bgColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Background Color</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input 
                                type="color" 
                                {...field}
                                className="w-12 h-9 p-1 cursor-pointer"
                              />
                              <Input 
                                type="text" 
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(val) => field.onChange(parseInt(val))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SIZE_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value.toString()}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="errorCorrection"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Error Correction</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ERROR_CORRECTION_LEVELS.map((level) => (
                              <SelectItem
                                key={level.value}
                                value={level.value}
                              >
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex flex-col items-center gap-6">
              <div className="bg-white p-4 rounded-lg" ref={qrRef} />

              <div className="flex gap-4">
                <Button
                  onClick={handleDownload}
                  disabled={!content}
                  className="w-32"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  onClick={handleCopy}
                  disabled={!content}
                  variant="outline"
                  className="w-32"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}