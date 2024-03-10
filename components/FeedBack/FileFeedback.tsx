import * as React from "react";
import Accordion from "@mui/material/Accordion";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { MdOutlineDelete } from "react-icons/md";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { styled } from "@mui/material/styles";
import { DeleteFileAPI, GetFileAPI } from "@/lib/fetch";
import Link from "next/link";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));
const listItemStyle = {
  "&:hover": {
    backgroundColor: "transparent",
  },
};

interface Naming {
  category: string[];
  drive: string;
  id: string;
  summary: string;
  year: string;
  compare: string;
  title: string;
}

export default function FileFeedback({
  data,
  fileName,
  size,
  progress,
}: {
    fileName: string;
    size: number;
    progress: string;
    data: Naming;
}) {
  const [reload, setReload] = React.useState(false);
  const [isClicked, setIsClicked] = React.useState(false);
  console.log(data);

  const generate = (
    dataItem: Naming,
    fileName: string,
    size: number,
    progress: string
  ) => {
    return (
      <ListItem sx={listItemStyle} key={dataItem.id}>
        <ListItemButton role={undefined} dense>
          <ListItemIcon></ListItemIcon>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
              }}
            >
              <div className="summary-container ">
                <div className=" font-bold">{dataItem.title || "Heading"}</div>
                <div className=" font-thin text-sm  ">{dataItem.compare != "" && `Compare: ${dataItem.compare}` || "Compare"}</div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <table>
                <tbody>
                  <tr>
                    <td>Category</td>
                    <td>{dataItem.category}</td>
                  </tr>
                  <tr>
                    <td>Drive</td>
                    <Link
                      href={dataItem.drive}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300"
                    >
                      {dataItem.drive}
                    </Link>
                  </tr>
                  <tr>
                    <td>Summary</td>
                    <td>{dataItem.summary}</td>
                  </tr>
                  <tr>
                    <td>Year</td>
                    <td>{dataItem.year}</td>
                  </tr>
                </tbody>
              </table>
            </AccordionDetails>
          </Accordion>
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Demo
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <div className="font-extrabold w-72 md:w-1/3 flex items-center justify-between">
        <div className="">
        </div>
      </div>
      <List dense={false} sx={listItemStyle}>
        {generate(data, fileName, size, progress)}
      </List>
    </Demo>
  );
}
