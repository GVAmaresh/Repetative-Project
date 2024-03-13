import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Link from "next/link";

export default function CardTemplate({
  icon,
  cardName,
  description,
  link,
}: {
  icon: React.ReactNode;
  cardName: string;
  description: string;
  link: string;
}) {
  return (
    <Link href={link}>
      <Card sx={{ maxWidth: 500, height: 200 }}>
        <CardActionArea>
          <CardContent
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="pb-7 md:pb-10 text-center">{icon}</div>
            <Typography gutterBottom variant="h5" component="div">
              <div className=" font-extrabold text-base">{cardName}</div>
              
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
