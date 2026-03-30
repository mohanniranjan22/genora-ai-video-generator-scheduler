import { 
  AbsoluteFill, 
  Audio, 
  Img, 
  Sequence, 
  spring, 
  useCurrentFrame, 
  useVideoConfig,
  interpolate,
  Easing
} from "remotion";
import { z } from "zod";

export const MainPropsSchema = z.object({
  audioUrl: z.string(),
  imageUrls: z.array(z.string()),
  captions: z.array(z.object({
    word: z.string(),
    start: z.number(),
    end: z.number(),
    confidence: z.number()
  })),
  captionStyle: z.string().optional().default("modern-yellow"),
  seriesName: z.string(),
  episodeNumber: z.number()
});

export const MainComposition: React.FC<z.infer<typeof MainPropsSchema>> = ({
  audioUrl,
  imageUrls,
  captions,
  captionStyle,
  seriesName,
  episodeNumber
}) => {
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  // 1. Calculate Image Timings
  const framesPerImage = Math.floor(durationInFrames / imageUrls.length);

  // 2. Group Words into 2-3 word "bursts"
  const bursts = [];
  const wordsPerBurst = 3;
  for (let i = 0; i < captions.length; i += wordsPerBurst) {
    const chunk = captions.slice(i, i + wordsPerBurst);
    bursts.push({
      text: chunk.map(w => w.word).join(" "),
      start: chunk[0].start,
      end: chunk[chunk.length - 1].end
    });
  }

  return (
    <AbsoluteFill className="bg-black overflow-hidden">
      {/* Audio Layer */}
      {audioUrl && <Audio src={audioUrl} />}

      {/* Image Layer with Ken Burns Animation */}
      {imageUrls.map((url, index) => {
        const startFrame = index * framesPerImage;
        const duration = index === imageUrls.length - 1 ? durationInFrames - startFrame : framesPerImage;
        
        return (
          <Sequence key={url} from={startFrame} durationInFrames={duration}>
            <ImageClip url={url} index={index} />
          </Sequence>
        );
      })}

      {/* Captions Layer */}
      <AbsoluteFill className="flex items-center justify-center pointer-events-none p-12">
        <div className="mt-[60%] flex flex-wrap justify-center content-center w-full">
          {bursts.map((burst, i) => {
            const startFrame = Math.floor(burst.start * fps);
            const endFrame = Math.floor(burst.end * fps);
            
            if (frame >= startFrame && frame <= endFrame) {
              return (
                <CaptionWord 
                  key={i} 
                  text={burst.text} 
                  active={true}
                  styleId={captionStyle || "modern-yellow"}
                />
              );
            }
            return null;
          })}
        </div>
      </AbsoluteFill>

      {/* Branding Overlay */}
      <div className="absolute top-10 left-10 flex flex-col gap-1 items-start opacity-70">
         <div className="bg-purple-600 px-3 py-1 rounded text-white text-xs font-black uppercase tracking-widest">
            {seriesName}
         </div>
         <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded text-white text-[10px] font-bold uppercase border border-white/10">
            Episode #{episodeNumber}
         </div>
      </div>
    </AbsoluteFill>
  );
};

const ImageClip: React.FC<{ url: string; index: number }> = ({ url, index }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, height } = useVideoConfig();

  // Pick a transition type based on index
  const transitionType = index % 3; // 0: Zoom, 1: Slide Up, 2: Slide Down

  // 1. Zoom (Ken Burns)
  const scale = interpolate(
    frame,
    [0, durationInFrames],
    [1, 1.3],
    { easing: Easing.bezier(0.42, 0, 0.58, 1), extrapolateRight: "clamp" }
  );

  // 2. Slide Up/Down
  const translateY = transitionType === 1 
    ? interpolate(frame, [0, durationInFrames], [20, -20]) // Slow drift up
    : transitionType === 2 
      ? interpolate(frame, [0, durationInFrames], [-20, 20]) // Slow drift down
      : 0;

  // 3. Fade In at start of each clip
  const opacity = interpolate(
    frame,
    [0, 15],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img 
        src={url} 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translateY(${translateY}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const CaptionWord: React.FC<{ text: string; active: boolean; styleId: string }> = ({ text, active, styleId }) => {
  const frame = useCurrentFrame();
  
  // High-energy spring animation
  const springValue = spring({
    frame,
    fps: 30,
    config: { stiffness: 200, damping: 15 },
  });

  // Dynamic Styling based on the selected ID
  const getStyle = (): React.CSSProperties => {
    switch (styleId) {
      case "minimalist":
        return {
          color: "white",
          fontWeight: 500,
          fontSize: "5rem",
          textShadow: "0px 4px 10px rgba(0,0,0,0.3)",
          textTransform: "none",
        };
      case "netflix":
        return {
          color: "white",
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: "10px 30px",
          borderRadius: "4px",
          fontFamily: "Arial, sans-serif",
          fontSize: "4rem",
          textTransform: "none",
        };
      case "cyber-neon":
        return {
          color: "#00FF00",
          fontWeight: "bold",
          fontSize: "6rem",
          fontStyle: "italic",
          textShadow: "0 0 10px #00FF00, 0 0 20px #00FF00",
          textTransform: "uppercase",
        };
      case "highlight":
        return {
          color: "white",
          backgroundColor: "#9333ea", // purple-600
          padding: "5px 25px",
          borderRadius: "8px",
          fontWeight: 900,
          fontSize: "5.5rem",
          textTransform: "uppercase",
        };
      case "pop-up":
        return {
          color: "white",
          fontWeight: 900,
          fontSize: "7rem",
          textShadow: "4px 4px 20px rgba(0,0,0,0.5)",
          textTransform: "uppercase",
        };
      case "modern-yellow":
      default:
        return {
          color: "#FCFF00",
          fontWeight: 900,
          fontSize: "7rem",
          textTransform: "uppercase",
          textShadow: '4px 4px 0px #000, -4px -4px 0px #000, 4px -4px 0px #000, -4px 4px 0px #000, 0px 8px 30px rgba(0,0,0,0.3)',
        };
    }
  };

  const dynamicStyle = getStyle();

  return (
    <span 
      style={{
        ...dynamicStyle,
        transform: `scale(${0.8 + springValue * 0.3}) rotate(${(springValue - 0.5) * 5}deg)`,
        opacity: active ? 1 : 0,
        lineHeight: '1.2',
        display: 'inline-block',
        letterSpacing: '-2px',
      }}
      className="px-4 py-2"
    >
      {text}
    </span>
  );
};
