"use client";
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
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
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
  title?: string;
  project?: string;
}
export default function DeleteReport() {
  const [getData, setData] = React.useState<Naming[] | null>(null);
  const [reload, setReload] = React.useState(false);
  const [isClicked, setIsClicked] = React.useState(false);

  const [checked, setChecked] = React.useState<string[]>([]);

  const handleDelete = () => {
    console.log(checked);
    setIsClicked(!isClicked);
    DeleteFileAPI(checked).then((data) => {
      if(data.success) {
        setIsClicked(false)
        GetFileAPI().then((data) => {
          setData(data.data);
        });
      }
    });
  };
  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const generate = (item: Naming) => {
    return (
      <ListItem sx={listItemStyle} key={item.id}>
        <ListItemButton
          role={undefined}
          onClick={() => handleToggle(item.id)()}
          dense
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={checked.indexOf(item.id) !== -1}
              tabIndex={-1}
              disableRipple
              inputProps={{ "aria-labelledby": item.id }}
            />
          </ListItemIcon>

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
              {item.project || "No Name"}
            </AccordionSummary>
            <AccordionDetails>
              <table>
                <tbody>
                  <tr>
                    <td>Drive</td>
                    <td className="text-cyan-300">
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-300"
                        href={item.drive}
                      >
                        {item.drive}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>Summary</td>
                    <td>{item.summary}</td>
                  </tr>
                  <tr>
                    <td>Year</td>
                    <td>{item.year}</td>
                  </tr>
                </tbody>
              </table>
            </AccordionDetails>
          </Accordion>
        </ListItemButton>
      </ListItem>
    );
  };

  React.useEffect(() => {
    GetFileAPI().then((data) => {
      setData(data.data);
    });
  }, [setReload, setData]);

  return (
    <Demo>
      <div className="font-extrabold border-b-2 w-7 md:w-1/3 p-2 md:ml-20 flex items-center justify-between">
        <div className="">Select Item For Deleting</div>
        <div className="">
          {checked.length >= 1 && (
            <MdOutlineDelete
              size={28}
              onClick={handleDelete}
              className={isClicked ? "text-red-500" : ""}
            />
          )}
        </div>
      </div>
      <List dense={false} sx={listItemStyle}>
        {getData != null &&
          getData.map((value) => {
            const labelId = `checkbox-list-label-${value}`;
            return generate(value);
          })}
      </List>
    </Demo>
  );
}
