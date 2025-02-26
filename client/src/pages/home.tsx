import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertQrCodeSchema, type InsertQrCode } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  ERROR_CORRECTION_LEVELS,
  DOT_STYLES,
  CORNER_SQUARE_STYLES,
  CORNER_DOT_STYLES,
  QR_MODES,
  GRADIENT_TYPES,
  COLOR_TYPES,
  FILE_EXTENSIONS,
  DEFAULT_VALUES,
  WIDTH_OPTIONS,
  MARGIN_OPTIONS,
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  IMAGE_SIZE_OPTIONS,
  IMAGE_MARGIN_OPTIONS,
  TYPE_NUMBER_OPTIONS,
} from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  QrCode,
  Link2,
  PaintBucket,
  Square,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const { toast } = useToast();
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrCode, setQrCode] = useState<any>(null);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);

  useEffect(() => {
    try {
      const qr = new QRCodeStyling({
        width: DEFAULT_VALUES.size,
        height: DEFAULT_VALUES.size,
        type: 'svg',
        data: ' ',
        margin: DEFAULT_VALUES.margin,
        qrOptions: {
          typeNumber: DEFAULT_VALUES.typeNumber,
          mode: 'Byte',
          errorCorrectionLevel: 'Q'
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: DEFAULT_VALUES.imageSize,
          margin: DEFAULT_VALUES.imageMargin,
          crossOrigin: 'anonymous',
        },
        dotsOptions: {
          type: 'square',
          color: '#000000'
        },
        backgroundOptions: {
          color: '#FFFFFF',
        },
        cornersSquareOptions: {
          type: 'extra-rounded',
          color: '#000000'
        },
        cornersDotOptions: {
          type: 'dot',
          color: '#000000'
        },
      });
      setQrCode(qr);
    } catch (error) {
      console.error('Error initializing QR code:', error);
      toast({
        title: "Error",
        description: "Failed to initialize QR code generator",
        variant: "destructive",
      });
    }
  }, []);

  const form = useForm<InsertQrCode>({
    resolver: zodResolver(insertQrCodeSchema),
    defaultValues: {
      content: "",
      width: DEFAULT_VALUES.size,
      height: DEFAULT_VALUES.size,
      margin: DEFAULT_VALUES.margin,
      dotStyle: "square",
      dotColorType: "single",
      dotColor: "#000000",
      dotGradient: {type: "linear", rotation: 0, colorStops: [{offset: 0, color: "#000000"}, {offset: 1, color: "#000000"}]},
      cornerSquareStyle: "extra-rounded",
      cornerSquareColorType: "single",
      cornerSquareColor: "#000000",
      cornerDotStyle: "none",
      cornerDotColorType: "single",
      cornerDotColor: "#000000",
      backgroundColorType: "single",
      backgroundColor: "#FFFFFF",
      hideBackgroundDots: true,
      imageSize: DEFAULT_VALUES.imageSize,
      imageMargin: DEFAULT_VALUES.imageMargin,
      qrMode: "Byte",
      errorCorrectionLevel: "Q",
      typeNumber: DEFAULT_VALUES.typeNumber,
    },
  });

  const {
    content,
    width,
    height,
    margin,
    dotStyle,
    dotColorType,
    dotColor,
    dotGradient,
    cornerSquareStyle,
    cornerSquareColor,
    cornerDotStyle,
    cornerDotColor,
    backgroundColor,
    hideBackgroundDots,
    imageSize,
    imageMargin,
    qrMode,
    errorCorrectionLevel,
    typeNumber,
  } = form.watch();

  useEffect(() => {
    if (qrRef.current && qrCode) {
      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);
    }
  }, [qrCode]);

  useEffect(() => {
    if (!content || !qrCode) return;

    try {
      qrCode.update({
        data: content,
        width,
        height,
        margin,
        dotsOptions: {
          type: dotStyle,
          color: dotColor,
          gradient: dotColorType === 'gradient' ? dotGradient : undefined,
        },
        cornersSquareOptions: {
          type: cornerSquareStyle,
          color: cornerSquareColor,
        },
        cornersDotOptions: {
          type: cornerDotStyle,
          color: cornerDotColor,
        },
        backgroundOptions: {
          color: backgroundColor,
        },
        imageOptions: {
          hideBackgroundDots,
          imageSize,
          margin: imageMargin,
        },
        qrOptions: {
          typeNumber,
          mode: qrMode,
          errorCorrectionLevel,
        }
      });
    } catch (error) {
      console.error('Error updating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to update QR code",
        variant: "destructive",
      });
    }
  }, [
    content, width, height, margin,
    dotStyle, dotColor, dotGradient, dotColorType,
    cornerSquareStyle, cornerSquareColor,
    cornerDotStyle, cornerDotColor,
    backgroundColor, hideBackgroundDots,
    imageSize, imageMargin,
    qrMode, errorCorrectionLevel, typeNumber,
    qrCode
  ]);

  const handleDownload = async (extension: string) => {
    if (!content || !qrCode) return;

    try {
      await qrCode.download({
        extension: extension,
      });

      toast({
        title: "QR Code Downloaded",
        description: `Your QR code has been downloaded as ${extension.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download QR code.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !qrCode) return;

    // Validate file type
    if (!Object.keys(ACCEPTED_IMAGE_TYPES).includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPEG, or SVG image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      toast({
        title: "File too large",
        description: "Image size should be less than 1MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      qrCode.update({
        image: imageUrl,
      });
      setHasUploadedImage(true);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">QR Code Generator</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Options */}
            <div className="space-y-6">
              {/* Main Options Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-primary" />
                    Main Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form className="space-y-6">
                      {/* Content Input */}
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter URL or text" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Width and Margin Dropdowns */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="width"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Width</FormLabel>
                              <Select
                                value={field.value.toString()}
                                onValueChange={(value) => field.onChange(parseInt(value))}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {WIDTH_OPTIONS.map((option) => (
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
                          name="margin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Margin</FormLabel>
                              <Select
                                value={field.value.toString()}
                                onValueChange={(value) => field.onChange(parseInt(value))}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {MARGIN_OPTIONS.map((option) => (
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
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Dots Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PaintBucket className="h-5 w-5 text-purple-500" />
                    Dots Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form className="space-y-6">
                      <FormField
                        control={form.control}
                        name="dotStyle"
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
                                {DOT_STYLES.map((style) => (
                                  <SelectItem
                                    key={style.value}
                                    value={style.value}
                                  >
                                    {style.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dotColorType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color Type</FormLabel>
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
                                {COLOR_TYPES.map((type) => (
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

                      {dotColorType === "single" ? (
                        <FormField
                          control={form.control}
                          name="dotColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Color</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input
                                    type="color"
                                    {...field}
                                    className="w-12 h-9 p-1 cursor-pointer"
                                  />
                                  <Input
                                    {...field}
                                    className="flex-1"
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ) : (
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="dotGradient.type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gradient Type</FormLabel>
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
                                    {GRADIENT_TYPES.map((type) => (
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
                            name="dotGradient.rotation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rotation</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={0}
                                    max={360}
                                    {...field}
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Corner Square Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Square className="h-5 w-5 text-green-500" />
                    Corner Square Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form className="space-y-6">
                      <FormField
                        control={form.control}
                        name="cornerSquareStyle"
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
                                {CORNER_SQUARE_STYLES.map((style) => (
                                  <SelectItem
                                    key={style.value}
                                    value={style.value}
                                  >
                                    {style.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cornerSquareColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input
                                  type="color"
                                  {...field}
                                  className="w-12 h-9 p-1 cursor-pointer"
                                />
                                <Input
                                  {...field}
                                  className="flex-1"
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Image Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-blue-500" />
                    Image Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form className="space-y-6">
                      <FormItem>
                        <FormLabel>Logo Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept={Object.keys(ACCEPTED_IMAGE_TYPES).join(',')}
                            onChange={handleImageUpload}
                            className="cursor-pointer"
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          Max size: 1MB. Supported formats: PNG, JPEG, SVG
                        </p>
                      </FormItem>

                      {hasUploadedImage && (
                        <>
                          <FormField
                            control={form.control}
                            name="hideBackgroundDots"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between">
                                <FormLabel>Hide Background Dots</FormLabel>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="imageSize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image Size</FormLabel>
                                <Select
                                  value={field.value.toString()}
                                  onValueChange={(value) => field.onChange(parseFloat(value))}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {IMAGE_SIZE_OPTIONS.map((option) => (
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
                            name="imageMargin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image Margin</FormLabel>
                                <Select
                                  value={field.value.toString()}
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {IMAGE_MARGIN_OPTIONS.map((option) => (
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
                        </>
                      )}
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* QR Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-amber-500" />
                    QR Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form className="space-y-6">
                      <FormField
                        control={form.control}
                        name="qrMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mode</FormLabel>
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
                                {QR_MODES.map((mode) => (
                                  <SelectItem
                                    key={mode.value}
                                    value={mode.value}
                                  >
                                    {mode.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="errorCorrectionLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Error Correction Level</FormLabel>
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

                      <FormField
                        control={form.control}
                        name="typeNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type Number</FormLabel>
                            <Select
                              value={field.value.toString()}
                              onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TYPE_NUMBER_OPTIONS.map((option) => (
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
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - QR Code Preview */}
            <div className="relative">
              <div className="sticky top-8 space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="bg-white dark:bg-black p-4 rounded-lg flex items-center justify-center" ref={qrRef} />

                    <div className="flex gap-4 mt-6">
                      {FILE_EXTENSIONS.map((ext) => (
                        <Button
                          key={ext.value}
                          onClick={() => handleDownload(ext.value)}
                          disabled={!content}
                          className="flex-1"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download {ext.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} QR Code Generator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}