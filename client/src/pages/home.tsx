import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertQrCodeSchema, type InsertQrCode } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ERROR_CORRECTION_LEVELS, SIZE_OPTIONS, QR_CONTENT_TYPES, STYLE_OPTIONS, DEFAULT_COLORS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { Download, Copy } from "lucide-react";
import { useMemo } from "react";

// Type for QR code module props
interface QRModuleProps {
  left: number;
  top: number;
  width: number;
  height: number;
}

function formatContent(type: string, content: string): string {
  switch (type) {
    case "url":
      return content.startsWith("http") ? content : `https://${content}`;
    case "email":
      return `mailto:${content}`;
    case "tel":
      return `tel:${content}`;
    case "sms":
      return `sms:${content}`;
    case "wifi":
      return `WIFI:T:WPA;S:${content};`;
    default:
      return content;
  }
}

export default function Home() {
  const { toast } = useToast();
  const form = useForm<InsertQrCode>({
    resolver: zodResolver(insertQrCodeSchema),
    defaultValues: {
      content: "",
      contentType: "text",
      size: 256,
      errorCorrection: "M",
      style: "squares",
      fgColor: DEFAULT_COLORS.fgColor,
      bgColor: DEFAULT_COLORS.bgColor,
    },
  });

  const { content, contentType, size, errorCorrection, style, fgColor, bgColor } = form.watch();
  const qrCodeValid = useMemo(() => content.length > 0, [content]);
  const formattedContent = useMemo(() => formatContent(contentType, content), [contentType, content]);

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

    try {
      await navigator.clipboard.writeText(formattedContent);
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

  // Get module render function based on style
  const getModuleRender = (style: string) => {
    switch (style) {
      case "dots":
        return ({ left, top, width, height }: QRModuleProps) => (
          <circle
            cx={left + width / 2}
            cy={top + height / 2}
            r={width / 2}
            fill={fgColor}
          />
        );
      case "rounded":
        return ({ left, top, width, height }: QRModuleProps) => (
          <rect
            x={left}
            y={top}
            width={width}
            height={height}
            rx={width / 3}
            ry={height / 3}
            fill={fgColor}
          />
        );
      case "classy":
        return ({ left, top, width, height }: QRModuleProps) => (
          <rect
            x={left}
            y={top}
            width={width}
            height={height}
            rx={width / 6}
            ry={height / 6}
            fill={fgColor}
          />
        );
      default:
        return undefined;
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
                    name="contentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Type</FormLabel>
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
                            {QR_CONTENT_TYPES.map((type) => (
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

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={
                              contentType === "url" ? "Enter website URL" :
                              contentType === "email" ? "Enter email address" :
                              contentType === "tel" ? "Enter phone number" :
                              contentType === "sms" ? "Enter phone number" :
                              contentType === "wifi" ? "Enter network name" :
                              "Enter text"
                            }
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Style</FormLabel>
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
                            {STYLE_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
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
              <div className="bg-white p-4 rounded-lg" style={{ backgroundColor: bgColor }}>
                <QRCodeSVG
                  value={formattedContent || " "}
                  size={size}
                  level={errorCorrection}
                  className="max-w-full h-auto"
                  fgColor={fgColor}
                  bgColor={bgColor}
                  includeMargin={true}
                  style={{
                    shapeRendering: style === "sharp" ? "crispEdges" : "geometricPrecision",
                  }}
                  moduleRender={getModuleRender(style)}
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