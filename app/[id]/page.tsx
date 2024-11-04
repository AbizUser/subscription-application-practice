import { 
  createServerComponentClient,
  SupabaseClient } from '@supabase/auth-helpers-nextjs';
import React from 'react'
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import { YouTubeEmbed } from "@next/third-parties/google"
// import { YoutubeEmbed } from "@next/third-parties/google"
import { extractYouTubeVideoId } from '@/utils/extractYouTubeVideoId';

//ジェネリクスで定義することによって型の参照が可能に

const LessonDatailPage = async ({ params }: { params: { id: string } }) => {

const getDetailLesson =  async (
  id: number,
  supabase: SupabaseClient<Database>
) => {
  const { data: lesson } = await supabase
    .from("lesson")
    .select("*")
    .eq("id", id) //idの値によって表示するデータを変更する
    .single();
  return lesson; 
};

const getPremiumContent =  async (
  id: number,
  supabase: SupabaseClient<Database>
) => {
  const { data: video } = await supabase
    .from("premium_contents")
    .select("video_url")
    .eq("id", id) //idの値によって表示するデータを変更する
    .single();
  return video; 
}


  const supabase = createServerComponentClient<Database>({ cookies }); //SCで呼び出す場合にはcookiesを引数に呼び出す必要がある。※SSR
  const [lesson, video] = await Promise.all([
    await getDetailLesson(params.id, supabase),
    await getPremiumContent(params.id, supabase),
  ]);
  const videoId = extractYouTubeVideoId(video?.video_url!) as string

  return (
    <div className='w-full max-w-3xl mx-auto py-16 px-8'>
      <h1 className='text-3xl mb-6'>{lesson?.title}</h1>
      <p className='mb-8'>{lesson?.description}</p>
      <YouTubeEmbed height={400} videoid={videoId} />
    </div>
  );
};

export default LessonDatailPage
