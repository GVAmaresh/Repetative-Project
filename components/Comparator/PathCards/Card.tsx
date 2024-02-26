import { ComparatorNav } from "@/components/SideNav/Nav";
import CardTemplate from "./CardTemplate";
import { Grid } from "@mui/material";

export default function Card() {
  return (
    <div className="container mt-20 ">
      <Grid
        sx={{ flexGrow: 1 }}
        container
        spacing={2}
        justifyContent="center"
        marginTop={2}
      >
        <Grid item xs={10}>
          <Grid container justifyContent="center" spacing={6}>
            {ComparatorNav.map((item, index) => (
              <Grid key={index} item xs={6} sm={3}>
                <CardTemplate
                  icon={item.icon}
                  cardName={item.cardName}
                  description={item.description}
                  link={item.link}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
