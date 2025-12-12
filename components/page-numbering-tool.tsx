'use client';

import React, { useState, useRef, lazy, Suspense } from 'react';
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
import { EmailShareButton } from '@/components/email-share-button';
import { FilenameDialog } from '@/components/filename-dialog';

// Lazy load PDF viewer to avoid SSR issues
const PDFViewer = lazy(() => import('@/components/pdf-viewer').then(mod => ({ default: mod.PDFViewer })));

type ProcessingStage = 'idle' | 'processing' | 'complete' | 'error';

interface ProcessingProgress {
  stage: ProcessingStage;
  currentPage?: number;
  totalPages?: number;
  percentage: number;
  message: string;
}

export function PageNumberingTool() {
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emailShareButtonRef = useRef<HTMLButtonElement>(null);

  // State
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<ProcessingProgress>({
    stage: 'idle',
    percentage: 0,
    message: '',
  });
  const [processedPdf, setProcessedPdf] = useState<Blob | null>(null);
  const [processedPdfData, setProcessedPdfData] = useState<Uint8Array | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFilenameDialog, setShowFilenameDialog] = useState(false);
  const [pendingFilename, setPendingFilename] = useState("");

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

    // Show PDF viewer when user clicks the button
    setShowPdfViewer(true);

    try {
      setProgress({
        stage: 'processing',
        percentage: 50,
        message: t('tools.pageNumbering.processing'),
      });
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('position', position);
      formData.append('style', style);
      formData.append('fontSize', fontSize.toString());
      formData.append('startNumber', startNumber.toString());
      if (prefix) formData.append('prefix', prefix);
      if (suffix) formData.append('suffix', suffix);

      const response = await fetch('/api/page-numbering', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add page numbers');
      }

      const blob = await response.blob();
      console.log('Received blob size:', blob.size, 'type:', blob.type);

      // Store blob for download
      setProcessedPdf(blob);

      // Convert to Uint8Array for PDF viewer
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      setProcessedPdfData(uint8Array);
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

  const getDefaultFilename = () => {
    if (!file) return "numbered.pdf";
    return file.name.replace('.pdf', '_numbered.pdf');
  };

  const handleDownload = () => {
    setShowFilenameDialog(true);
  };

  const handleFilenameConfirm = async (filename: string, action: 'download' | 'email') => {
    if (!processedPdf) {
      console.error('No processed PDF found');
      return;
    }

    console.log('handleFilenameConfirm - processedPdf blob size:', processedPdf.size);

    setPendingFilename(filename);

    if (action === 'download') {
      const url = URL.createObjectURL(processedPdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(t('tools.pageNumbering.downloadSuccess'));
    } else {
      // Trigger email share button click
      emailShareButtonRef.current?.click();
    }
  };

  const generateBlob = async (): Promise<Blob | null> => {
    if (!processedPdf) return null;
    return processedPdf;
  };

  const resetState = () => {
    setFile(null);
    setProgress({ stage: 'idle', percentage: 0, message: '' });
    setProcessedPdf(null);
    setProcessedPdfData(null);
    setError(null);
    setShowPdfViewer(false);
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
    <div className={`grid grid-cols-1 gap-6 transition-all duration-500 ${showPdfViewer ? 'lg:grid-cols-3' : ''}`}>
      {/* Left Column - Toolbox */}
      <Card className={showPdfViewer ? 'lg:col-span-1' : ''}>
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
                <Button onClick={handleDownload} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Download className="mr-2 h-4 w-4" />
                  Save PDF
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

          {/* Hidden Email Share Button */}
          <div className="hidden">
            <EmailShareButton
              ref={emailShareButtonRef}
              onGenerateBlob={generateBlob}
              fileName={pendingFilename || getDefaultFilename()}
              shareMessage="I've added page numbers to a PDF using Mon PDF."
            />
          </div>

          {/* Filename Dialog */}
          <FilenameDialog
            open={showFilenameDialog}
            onOpenChange={setShowFilenameDialog}
            defaultFilename={getDefaultFilename()}
            onConfirm={handleFilenameConfirm}
            title="Save Numbered PDF"
            description="Choose a filename for your PDF with page numbers"
          />
        </CardContent>
      </Card>

      {/* Right Column - PDF Viewer (bigger) - Only show after clicking Add Page Numbers */}
      {showPdfViewer && (
        <div className="lg:col-span-2 animate-in fade-in slide-in-from-right-4 duration-500">
          <Suspense fallback={
            <div className="flex items-center justify-center h-[800px] border-2 border-dashed border-border rounded-lg">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading PDF viewer...</p>
              </div>
            </div>
          }>
            <PDFViewer file={processedPdfData} className="h-[800px]" />
          </Suspense>
        </div>
      )}
    </div>
  );
}
