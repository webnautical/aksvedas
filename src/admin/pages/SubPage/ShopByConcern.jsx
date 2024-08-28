import React, { useEffect, useState } from "react";
import { APICALL } from "../../../utility/api/api";
import Spinner from "../../../components/admin/Spinner";
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from "@mui/material";
import { toastifySuccess } from "../../../utility/Utility";
import { json } from "react-router-dom";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const ShopByConcern = () => {
    const [loading, setLoading] = useState();
    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([]);
    useEffect(() => {
        getAllTagsFun();
        selectedTagsFun()
    }, []);

    const getAllTagsFun = async () => {
        try {
            setLoading(true);
            const res = await APICALL("/get-tags/admin");
            if (res?.status) {
                setTags(res?.data);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    console.log("selectedTags",selectedTags)

    const selectedTagsFun = async () => {
        try {
            setLoading(true);
            const res = await APICALL("get-tags/tags");
            if (res?.status) {
                const tagsArray = res?.data?.tags?.split?.(',')?.map(tag => tag?.trim()) || [];
                setSelectedTags(tagsArray);
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }

    };

    const submitTags = async () => {
        try {
            const formData = new FormData();
            formData.append("tags", selectedTags);
            formData.append("type", 'tags');
            setLoading(true);
            const res = await APICALL("/add-tags", 'post', formData);
            if (res?.status) {
                toastifySuccess('Update Successfully !!')
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    const handleCategoryChange = (event) => {
        const { target: { value }, } = event;
        setSelectedTags(
            typeof value === 'string' ? value.split(',') : value
        );
    };

    return (
        <>
            <div className="card mb-4">
                <div className="card-widget-separator-wrapper">
                    <div className="card-body card-widget-separator">
                        <div className="row gy-4 gy-sm-1">
                            <div className="col-sm-12 col-lg-12">
                                <h5 className="d-flex justify-content-between">
                                    Shop By Concern
                                </h5>
                                <div className="justify-content-between align-items-start pb-3 pb-sm-0 card-widget-3">
                                    <div className="row pb-4">
                                        <div className="col-5">
                                            <FormControl
                                                sx={{ width: "100%" }}
                                                className="main_multi"
                                            >
                                                <InputLabel id="multiple-checkbox-label bg-white">
                                                    Select Tags
                                                </InputLabel>
                                                <Select
                                                    labelId="multiple-checkbox-label"
                                                    id="multiple-checkbox"
                                                    multiple
                                                    value={selectedTags}
                                                    onChange={handleCategoryChange}
                                                    input={<OutlinedInput label="Tag" />}
                                                    renderValue={(selected) =>
                                                        selected.map((id) => tags.find((tag) => tag === id)).join(", ")
                                                    }
                                                    className="check_select"
                                                    inputProps={{ "aria-label": "Select Tags" }}
                                                    placeholder="Select Tags"
                                                >
                                                    {tags.map((tag, index) => (
                                                        <MenuItem key={index} value={tag}>
                                                            <Checkbox checked={selectedTags.indexOf(tag) > -1} />
                                                            <ListItemText primary={tag} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className="col-5">
                                            <button className="btn btn-primary" onClick={() => submitTags()}>Save Change</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Spinner sppiner={loading} />

        </>
    )
}

export default ShopByConcern