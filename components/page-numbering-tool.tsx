'use client';

import React, { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Loader2,
  Download,
  Hash,
  AlertCircle,
  CheckCircle,
  Trash2,
  FileText,
  Settings,
  Palette,
} from 'lucide-react';

import { addPageNumbers, NumberPosition, NumberStyle, PageNumberingOptions } from '@/lib/pdf/page-numbering';
import { PageNumberPositionSelector } from '@/components/page-number-position-selector';
import { PDFViewer } from '@/components/pdf-viewer';

type ProcessingStage = 'idle' | 'processing' | 'complete' | 'error';

interface ProcessingProgress {
  stage: ProcessingStage;
  currentPage?: number;
  totalPages?: number;
  percentage: number;
  message: string;
}

export function PageNumberingTool() {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<ProcessingProgress>({
    stage: 'idle',
    percentage: 0,
    message: '',
  });
  const [processedPdf, setProcessedPdf] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Options state
  const [position, setPosition] = useState<NumberPosition>('bottom-center');
  const [style, setStyle] = useState<NumberStyle>('numeric');
  const [fontSize, setFontSize] = useState<number>(12);
  const [startPage, setStartPage] = useState<number>(1);
  const [startNumber, setStartNumber] = useState<number>(1);
  const [prefix, setPrefix] = useState<string>('');
  const [suffix, setSuffix] = useState<string>('');
  const [fontColor, setFontColor] = useState<string>('#000000');
  const [marginX, setMarginX] = useState<number>(40);
  const [marginY, setMarginY] = useState<number>(40);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  const handleFileUpload = async (selectedFile: File) => {
    if (!selectedFile.type.includes('pdf')) {
      setError(t('tools.pageNumbering.invalidPdf'));
      return;
    }

    setError(null);
    setFile(selectedFile);
    setProcessedPdf(null);
    setProgress({ stage: 'idle', percentage: 0, message: '' });
  };

  const handleAddNumbers = async () => {
    if (!file) return;

    try {
      setProgress({
        stage: 'processing',
        percentage: 0,
        message: t('tools.pageNumbering.processing'),
      });
      setError(null);

      // Parse color
      const colorHex = fontColor.replace('#', '');
      const r = parseInt(colorHex.substring(0, 2), 16) / 255;
      const g = parseInt(colorHex.substring(2, 4), 16) / 255;
      const b = parseInt(colorHex.substring(4, 6), 16) / 255;

      const options: PageNumberingOptions = {
        position,
        style,
        fontSize,
        startPage,
        startNumber,
        prefix,
        suffix,
        fontColor: { r, g, b },
        marginX,
        marginY,
      };

      const result = await addPageNumbers(file, options, (current, total) => {
        const percentage = Math.round((current / total) * 100);
        setProgress({
          stage: 'processing',
          currentPage: current,
          totalPages: total,
          percentage,
          message: t('tools.pageNumbering.processingPage', { current, total }),
        });
      });

      setProcessedPdf(result);
      setProgress({
        stage: 'complete',
        percentage: 100,
        message: t('tools.pageNumbering.complete'),
      });

      toast.success(t('tools.pageNumbering.successTitle'), {
        description: t('tools.pageNumbering.successDescription'),
        duration: 3000,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t('tools.pageNumbering.processingError');
      setError(errorMessage);
      setProgress({ stage: 'error', percentage: 0, message: errorMessage });
      toast.error(t('tools.pageNumbering.errorTitle'), {
        description: errorMessage,
        duration: 4000,
      });
    }
  };

  const handleDownload = () => {
    if (!processedPdf || !file) return;

    const blob = new Blob([processedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name.replace('.pdf', '_numbered.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(t('tools.pageNumbering.downloadSuccess'));
  };

  const resetState = () => {
    setFile(null);
    setProgress({ stage: 'idle', percentage: 0, message: '' });
    setProcessedPdf(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStyleExample = (s: NumberStyle) => {
    const examples = {
      numeric: '1, 2, 3...',
      'roman-lower': 'i, ii, iii...',
      'roman-upper': 'I, II, III...',
      'alpha-lower': 'a, b, c...',
      'alpha-upper': 'A, B, C...',
    };
    return examples[s];
  };

  const previewText = `${prefix}${style === 'numeric' ? '1' : style === 'roman-lower' ? 'i' : style === 'roman-upper' ? 'I' : style === 'alpha-lower' ? 'a' : 'A'}${suffix}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Toolbox (smaller) */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            {t('tools.pageNumbering.title')}
          </CardTitle>
          <CardDescription className="text-xs">{t('tools.pageNumbering.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          {progress.stage === 'idle' && !file && (
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">{t('tools.pageNumbering.uploadPrompt')}</p>
                <p className="text-sm text-muted-foreground">{t('tools.pageNumbering.uploadHint')}</p>
              </label>
            </div>
          )}

          {/* File Info */}
          {file && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </AlertDescription>
            </Alert>
          )}

          {/* Configuration */}
          {file && progress.stage === 'idle' && (
            <div className="space-y-4">
              {/* Position Selector */}
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-1.5">
                  <Settings className="h-3.5 w-3.5" />
                  {t('tools.pageNumbering.position')}
                </Label>
                <PageNumberPositionSelector value={position} onChange={setPosition} />
              </div>

              <Separator />

              {/* Number Style */}
              <div className="space-y-2">
                <Label htmlFor="style" className="text-sm">{t('tools.pageNumbering.numberStyle')}</Label>
                <Select value={style} onValueChange={(v) => setStyle(v as NumberStyle)}>
                  <SelectTrigger id="style" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="numeric">
                      {t('tools.pageNumbering.styleNumeric')} ({getStyleExample('numeric')})
                    </SelectItem>
                    <SelectItem value="roman-lower">
                      {t('tools.pageNumbering.styleRomanLower')} ({getStyleExample('roman-lower')})
                    </SelectItem>
                    <SelectItem value="roman-upper">
                      {t('tools.pageNumbering.styleRomanUpper')} ({getStyleExample('roman-upper')})
                    </SelectItem>
                    <SelectItem value="alpha-lower">
                      {t('tools.pageNumbering.styleAlphaLower')} ({getStyleExample('alpha-lower')})
                    </SelectItem>
                    <SelectItem value="alpha-upper">
                      {t('tools.pageNumbering.styleAlphaUpper')} ({getStyleExample('alpha-upper')})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <Label htmlFor="fontSize" className="text-sm">
                  {t('tools.pageNumbering.fontSize')}: {fontSize}px
                </Label>
                <Slider
                  id="fontSize"
                  min={8}
                  max={24}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(v) => setFontSize(v[0])}
                />
              </div>

              {/* Prefix and Suffix */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="prefix" className="text-sm">{t('tools.pageNumbering.prefix')}</Label>
                  <Input
                    id="prefix"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="Page "
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suffix" className="text-sm">{t('tools.pageNumbering.suffix')}</Label>
                  <Input
                    id="suffix"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder=" of X"
                    className="h-9"
                  />
                </div>
              </div>

              {/* Start Page and Number */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="startPage" className="text-sm">{t('tools.pageNumbering.startPage')}</Label>
                  <Input
                    id="startPage"
                    type="number"
                    min={1}
                    value={startPage}
                    onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startNumber" className="text-sm">{t('tools.pageNumbering.startNumber')}</Label>
                  <Input
                    id="startNumber"
                    type="number"
                    min={1}
                    value={startNumber}
                    onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                    className="h-9"
                  />
                </div>
              </div>

              {/* Font Color */}
              <div className="space-y-2">
                <Label htmlFor="fontColor" className="text-sm flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5" />
                  {t('tools.pageNumbering.fontColor')}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="fontColor"
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="w-12 h-9 p-1 cursor-pointer"
                  />
                  <Input value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="h-9" />
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label className="text-sm">{t('tools.pageNumbering.preview')}</Label>
                <div className="border rounded-lg p-3 bg-muted/20 text-center">
                  <Badge
                    variant="outline"
                    className="px-3 py-1"
                    style={{ fontSize: `${fontSize}px`, color: fontColor }}
                  >
                    {previewText}
                  </Badge>
                </div>
              </div>

              {/* Action Button */}
              <Button onClick={handleAddNumbers} className="w-full">
                <Hash className="mr-2 h-4 w-4" />
                {t('tools.pageNumbering.addNumbers')}
              </Button>
            </div>
          )}

          {/* Progress */}
          {progress.stage === 'processing' && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">{progress.message}</span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success */}
          {progress.stage === 'complete' && (
            <div className="space-y-3">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{progress.message}</AlertDescription>
              </Alert>

              <div className="flex flex-col gap-2">
                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  {t('tools.pageNumbering.download')}
                </Button>
                <Button onClick={resetState} variant="outline" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('tools.pageNumbering.processAnother')}
                </Button>
              </div>
            </div>
          )}

          {/* Reset Button */}
          {file && progress.stage === 'idle' && (
            <Button onClick={resetState} variant="outline" className="w-full" size="sm">
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              {t('tools.pageNumbering.reset')}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Right Column - PDF Viewer (bigger) */}
      <div className="lg:col-span-2">
        <PDFViewer file={processedPdf} className="h-[800px]" />
      </div>
    </div>
  );
}
