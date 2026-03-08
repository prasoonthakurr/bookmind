'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  voice: z.string().min(1, 'Select a voice'),
});

type FormValues = z.infer<typeof formSchema>;

const maleVoices = [
  { id: 'dave', name: 'Dave', desc: 'Young male, British-Essex, casual & conversational' },
  { id: 'daniel', name: 'Daniel', desc: 'Middle-aged male, British, authoritative but warm' },
  { id: 'chris', name: 'Chris', desc: 'Male, casual & easy-going' },
];

const femaleVoices = [
  { id: 'rachel', name: 'Rachel', desc: 'Young female, American, calm & clear' },
  { id: 'sarah', name: 'Sarah', desc: 'Young female, American, soft & approachable' },
];

const UploadForm: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { voice: 'rachel' },
  });

  useEffect(() => {
    if (coverFile) {
      const url = URL.createObjectURL(coverFile);
      setCoverPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCoverPreview(null);
    }
  }, [coverFile]);

  const onSubmit = async (data: FormValues) => {
    if (!pdfFile) {
      setError('title', { type: 'manual', message: 'PDF is required' });
      setError('author', { type: 'manual', message: 'PDF is required' });
      return;
    }

    setSubmitting(true);

    try {
      // assemble payload
      const payload = new FormData();
      payload.append('pdf', pdfFile);
      if (coverFile) payload.append('cover', coverFile);
      payload.append('title', data.title);
      payload.append('author', data.author);
      payload.append('voice', data.voice);

      // Simulate async upload / synthesis
      await new Promise((res) => setTimeout(res, 1400));
      // In real app: await fetch('/api/books', { method: 'POST', body: payload })
      // For now, log to console
      console.log('Submitted', { title: data.title, author: data.author, voice: data.voice, pdfFile, coverFile });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f) setPdfFile(f);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f) setCoverFile(f);
  };

  const removePdf = () => setPdfFile(null);
  const removeCover = () => setCoverFile(null);

  // ensure react-hook-form knows current voice if changed externally
  const selectedVoice = watch('voice');

  return (
    <div className="new-book-wrapper">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative">

        {submitting && (
          <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center">
            <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
              <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#663820" strokeWidth="4" strokeOpacity="0.2"/><path d="M22 12a10 10 0 00-10-10" stroke="#663820" strokeWidth="4" strokeLinecap="round"/></svg>
              <span style={{fontFamily: 'serif', color: '#663820'}}>Processing…</span>
            </div>
          </div>
        )}

        {/* PDF Dropzone */}
        <div>
          <label className="form-label">Book PDF File</label>
          <div className="upload-dropzone">
            {!pdfFile ? (
              <label className="block cursor-pointer p-6 text-center w-full">
                <input type="file" accept="application/pdf" onChange={handlePdfChange} className="hidden" />
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3 text-gray-500"><path d="M12 3v10" stroke="#88755e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 7l4-4 4 4" stroke="#88755e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 21H3" stroke="#88755e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div className="font-medium text-gray-700">Click to upload PDF</div>
                <div className="text-sm text-gray-400">PDF file (max 50MB)</div>
              </label>
            ) : (
              <div className="flex items-center justify-between p-4">
                <div className="truncate">{pdfFile.name}</div>
                <button type="button" onClick={removePdf} className="text-sm text-red-600">Remove</button>
              </div>
            )}
          </div>
        </div>

        {/* Cover Dropzone */}
        <div>
          <label className="form-label">Cover Image (Optional)</label>
          <div className="upload-dropzone">
            {!coverFile ? (
              <label className="block cursor-pointer p-6 text-center w-full">
                <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3 text-gray-500"><rect x="3" y="3" width="18" height="14" rx="2" stroke="#88755e" strokeWidth="1.5"/><path d="M3 17l4-4 4 4 6-6 4 6" stroke="#88755e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div className="font-medium text-gray-700">Click to upload cover image</div>
                <div className="text-sm text-gray-400">Leave empty to auto-generate from PDF</div>
              </label>
            ) : (
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {coverPreview && (
                    <Image
                      src={coverPreview}
                      alt="cover preview"
                      width={40}
                      height={56}
                      className="object-cover rounded"
                    />
                  )}
                  <div className="truncate">{coverFile.name}</div>
                </div>
                <button type="button" onClick={removeCover} className="text-sm text-red-600">Remove</button>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="form-label">Title</label>
          <input {...register('title')} placeholder="ex: Rich Dad Poor Dad" className="form-input w-full" />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
        </div>

        {/* Author */}
        <div>
          <label className="form-label">Author Name</label>
          <input {...register('author')} placeholder="ex: Robert Kiyosaki" className="form-input w-full" />
          {errors.author && <p className="text-sm text-red-600 mt-1">{errors.author.message}</p>}
        </div>

        {/* Voice selector */}
        <div>
          <label className="form-label">Choose Assistant Voice</label>
          <div className="mt-3">
            <div className="text-sm font-medium text-gray-700 mb-2">Male Voices</div>
            <div className="grid grid-cols-3 gap-3">
              {maleVoices.map((v) => {
                const selected = selectedVoice === v.id;
                return (
                  <label
                    key={v.id}
                    className={`cursor-pointer p-4 rounded border flex items-center gap-3 ${selected ? 'voice-selector-option-selected' : 'voice-selector-option'}`}>
                    <input
                      type="radio"
                      value={v.id}
                      {...register('voice')}
                      className="sr-only"
                      checked={selected}
                      onChange={() => setValue('voice', v.id)}
                    />
                    <div className={`shrink-0 h-5 w-5 rounded-full flex items-center justify-center border ${selected ? 'border-transparent' : ''}`} style={{ borderColor: selected ? '#663820' : '#d1d5db' }}>
                      {selected && <div className="h-2 w-2 rounded-full" style={{ background: '#663820' }} />}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{v.name}</div>
                      <div className="text-sm text-gray-500">{v.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-medium text-gray-700 mb-2">Female Voices</div>
            <div className="grid grid-cols-2 gap-3">
              {femaleVoices.map((v) => {
                const selected = selectedVoice === v.id;
                return (
                  <label
                    key={v.id}
                    className={`cursor-pointer p-4 rounded border flex items-center gap-3 ${selected ? 'voice-selector-option-selected' : 'voice-selector-option'}`}>
                    <input
                      type="radio"
                      value={v.id}
                      {...register('voice')}
                      className="sr-only"
                      checked={selected}
                      onChange={() => setValue('voice', v.id)}
                    />
                    <div className={`shrink-0 h-5 w-5 rounded-full flex items-center justify-center border ${selected ? 'border-transparent' : ''}`} style={{ borderColor: selected ? '#663820' : '#d1d5db' }}>
                      {selected && <div className="h-2 w-2 rounded-full" style={{ background: '#663820' }} />}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{v.name}</div>
                      <div className="text-sm text-gray-500">{v.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <button type="submit" className="form-btn w-full" style={{ background: '#663820', color: '#fff', fontFamily: 'serif' }}>
            Begin Synthesis
          </button>
        </div>

      </form>
    </div>
  );
};

export default UploadForm;