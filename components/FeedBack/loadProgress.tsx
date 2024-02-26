import * as React from "react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function LinearWithValueLabel() {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    if (progress >= 100) {
      return;
    }

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + 10;
        if (nextProgress >= 100) {
          return 100; 
        }
        return nextProgress;
      });
    }, 500); 

    return () => clearInterval(interval); 
  }, [progress]);

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}

export default function LinearProgressWithDetail({
  fileName,
  size,
  progress,
}: {
  fileName: string;
  size: number;
  progress: string;
}) {
  return (
    <>
      <div className="progressCard p-6 rounded-lg">
        <div className="pb-2">{fileName}</div>
        <div className="pb-6">{(size/1000000).toFixed(1)} MB</div>
        {progress == "progress" ? (
          <LinearWithValueLabel />
        ) : progress == "success" ? (
          <div className="text-lime-400 ">File Uploaded Successfully</div>
        ) : (
          <div className="text-red-500">File not Uploaded</div>
        )}
      </div>
    </>
  );
}
