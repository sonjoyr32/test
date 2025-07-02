
import React, { useState, useCallback } from 'react';
import { generateHashtags } from './services/geminiService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HashtagDisplay } from './components/HashtagDisplay';
import { PostInput } from './components/PostInput';
import { GenerateButton } from './components/GenerateButton';
import { Loader } from './components/Loader';

export default function App() {
  const [postContent, setPostContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!postContent.trim()) {
      setError('Please enter some content for your post.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHashtags([]);

    try {
      const result = await generateHashtags(postContent);
      const cleanedHashtags = result
        .split(' ')
        .filter(tag => tag.startsWith('#'))
        .map(tag => tag.trim());
      setHashtags(cleanedHashtags);
    } catch (e) {
      console.error(e);
      setError('Failed to generate hashtags. Please check your connection or API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [postContent]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm h-[800px] bg-white rounded-[40px] shadow-2xl border-8 border-black overflow-hidden flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto px-6 py-4 bg-slate-50">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">InstaTag AI</h1>
            <p className="text-sm text-slate-500">Your personal hashtag assistant</p>
          </div>

          <div className="space-y-6">
            <PostInput
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              disabled={isLoading}
            />
            
            <GenerateButton
              onClick={handleGenerate}
              isLoading={isLoading}
            />

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {isLoading && <Loader />}
            
            {hashtags.length > 0 && !isLoading && (
              <HashtagDisplay hashtags={hashtags} />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
