import { Composition } from "remotion";
import { MainComposition, MainPropsSchema } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainComposition}
        durationInFrames={1800} // Default 60s at 30fps, will be overridden by Lambda
        fps={30}
        width={1080}
        height={1920}
        schema={MainPropsSchema}
        defaultProps={{
          audioUrl: "",
          imageUrls: [] as string[],
          captions: [] as { word: string; start: number; end: number; confidence: number }[],
          seriesName: "Genora",
          episodeNumber: 1,
          captionStyle: "modern-yellow",
        }}
      />
    </>
  );
};
