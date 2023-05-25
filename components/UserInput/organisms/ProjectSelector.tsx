import { useCallback, useEffect, useMemo, useState } from "react";

import { matchSorter } from "match-sorter";
import { ProjectD0 } from "lib/types/projectTypes";
import Project from "lib/utils/projectUtils";
import useKeyboard from "lib/hooks/useKeyboard";
import TextField from "../molecules/TextField";

const ProjectSelector = ({
    id,
    className = "",
    dropdownClassName = "",
    label,
    error,
    value,
    projects,
    onChange,
}: {
    id: string;
    className?: string;
    dropdownClassName?: string;
    label?: string;
    error?: string;
    value: ProjectD0 | undefined;
    projects: ProjectD0[];
    onChange?: (newVal: ProjectD0 | undefined) => void;
}): JSX.Element => {
    const [innerValue, setInnerValue] = useState(value || Project.create(""));
    const [inputValue, setInputValue] = useState(value?.name || "");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const options = useMemo(() => {
        if (!inputValue) return [];
        return matchSorter(projects, inputValue || "", {
            keys: ["name"],
        });
    }, [inputValue]);

    useKeyboard(
        (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "ArrowUp") {
                if (highlightedIndex > 0) setHighlightedIndex(cur => cur - 1);
            } else if (e.key === "ArrowDown") {
                if (highlightedIndex < options.length - 1) setHighlightedIndex(cur => cur + 1);
            } else if (e.key === "Enter") {
                setSelectedIndex(highlightedIndex);
                setIsOpen(false);
                e.preventDefault();
            }
        },
        [isOpen, options, highlightedIndex]
    );

    useEffect(() => {
        if (selectedIndex === -1) return;
        setInputValue(options[selectedIndex].name);
    }, [selectedIndex]);

    useEffect(() => {
        if (!inputValue) {
            setInnerValue(Project.create(""));
            return;
        }
        let set = false;
        let newOpen = true;
        options.forEach(project => {
            if (project.name === inputValue) {
                setInnerValue(project);
                set = true;
                if (options.length === 1) {
                    //if there's only one option and it matches exactly,
                    //we can probably just close the popup list
                    newOpen = false;
                }
            }
        });
        setIsOpen(newOpen);
        if (!set) {
            setInnerValue(Project.create(inputValue));
        }
    }, [inputValue, options]);

    useEffect(() => {
        if (innerValue && onChange) onChange(innerValue);
    }, [innerValue]);

    useEffect(() => {
        if (!isOpen) setHighlightedIndex(-1);
    }, [isOpen]);

    const getListItems = useCallback(() => {
        return options
            .map((project, index) => {
                return (
                    <li
                        key={project.id}
                        className={
                            "text-lg px-2 cursor-pointer " +
                            (index === highlightedIndex ? " bg-neutral-700" : "") +
                            (project.slug === (value?.slug || "")
                                ? " bg-white bg-opacity-20 text-yellow-200 font-semibold"
                                : "")
                        }
                        onMouseDown={() => {
                            setSelectedIndex(index);
                            setIsOpen(false);
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                    >
                        {project.name}
                    </li>
                );
            })
            .slice(0, 10);
    }, [options, value, highlightedIndex]);

    return (
        <div onBlur={() => setIsOpen(false)} className="flex-grow">
            <TextField
                id={id}
                label={label}
                value={inputValue}
                onChange={setInputValue}
                error={error}
                className={`${className} ${
                    isOpen && getListItems().length > 0 ? " rounded-b-none border-b-0" : ""
                }`}
                onFocus={() => setIsOpen(true)}
            />
            {isOpen && (
                <ul
                    className={`project-dropdown bg-neutral-900 border-l border-r relative border-neutral-400 mb-5 select-none ${dropdownClassName} ${
                        isOpen && getListItems().length > 0
                            ? " border-l border-r border-b border-neutral-400 rounded rounded-t-none"
                            : ""
                    }`}
                    style={{
                        marginTop: "-1.25rem",
                    }}
                >
                    {getListItems()}
                </ul>
            )}
        </div>
    );
};

export default ProjectSelector;
