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
import { QRCodeSVG as QRCode } from "qrcode.react";
import { Download, Copy } from "lucide-react";
import { useMemo } from "react";

export default function Home() {
  const { toast } = useToast();
  const form = useForm<InsertQrCode>({
    resolver: zodResolver(insertQrCodeSchema),
    defaultValues: {
      content: "",
      size: 256,
      errorCorrection: "M",
    },
  });

  const { content, size, errorCorrection } = form.watch();
  const qrCodeValid = useMemo(() => content.length > 0, [content]);

  const handleDownload = () => {
    if (!qrCodeValid) return;

    const svg = document.querySelector("svg");
    if (!svg) return;

    // Create a canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match SVG
    canvas.width = size;
    canvas.height = size;

    // Create an image from the SVG
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    img.src = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "QR Code Downloaded",
        description: "Your QR code has been downloaded successfully.",
      });

      URL.revokeObjectURL(img.src);
    };
  };

  const handleCopy = async () => {
    if (!qrCodeValid) return;

    const svg = document.querySelector("svg");
    if (!svg) return;

    try {
      // Create a canvas from SVG
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = size;
      canvas.height = size;

      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });

      const promise = new Promise<void>((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(async (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob })
              ]);
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        };
        img.onerror = () => reject(new Error("Failed to load image"));
      });

      img.src = URL.createObjectURL(svgBlob);
      await promise;

      toast({
        title: "QR Code Copied",
        description: "Your QR code has been copied to clipboard.",
      });

      URL.revokeObjectURL(img.src);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy QR code to clipboard.",
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
                              <SelectItem key={level.value} value={level.value}>
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
              <div className="bg-white p-4 rounded-lg">
                <QRCode
                  value={content || " "}
                  size={size}
                  level={errorCorrection}
                  className="max-w-full h-auto"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleDownload}
                  disabled={!qrCodeValid}
                  className="w-32"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  onClick={handleCopy}
                  disabled={!qrCodeValid}
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