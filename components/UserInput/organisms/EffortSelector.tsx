import { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Effort from "lib/utils/effortUtils";
import Project from "lib/utils/projectUtils";
import { EffortOverview } from "lib/types/effortTypes";
import { ProjectD0, ProjectOverview } from "lib/types/projectTypes";
import ClientEffort from "lib/utils/client/effortUtilsClient";
import ClientProject from "lib/utils/client/projectUtilsClient";
import { EntryD0 } from "lib/types/entryTypes";
import { SelectAutoEffort } from "lib/AutoEffort";
import SelectField, { SelectOption } from "../molecules/SelectField";
import TextField from "../molecules/TextField";
dayjs.extend(relativeTime);

export interface EffortSelectorValue {
    id: number;
    title: string;
}

const EffortSelector = ({
    id,
    value,
    initialValue,
    entry,
    label,
    error,
    onChange,
    className,
    project,
    allowsAuto,
    allowsNew,
}: {
    id: string;
    value: EffortSelectorValue;
    initialValue?: EffortSelectorValue;
    entry: EntryD0;
    project: ProjectD0;
    label?: string;
    error?: string;
    onChange?: (newVal: EffortSelectorValue) => void;
    className?: string;
    allowsAuto?: boolean;
    allowsNew?: boolean;
}) => {
    const [fullProject, setFullProject] = useState<ProjectOverview | null>(null);
    const [efforts, setEfforts] = useState<EffortOverview[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(initialValue?.id || -1);
    const [customTitle, setCustomTitle] = useState("");
    const options = useMemo<SelectOption[]>(() => {
        return [
            ...(allowsAuto
                ? [
                      {
                          value: -1,
                          label: "Auto",
                      },
                  ]
                : []),
            ...(allowsNew
                ? [
                      {
                          value: -2,
                          label: "New",
                      },
                  ]
                : []),
            ...efforts.map(effort => {
                const text =
                    effort.title +
                    (effort.lastEntry ? " - " + dayjs(effort.lastEntry.createdAt).fromNow() : "");
                return {
                    value: effort.id,
                    label: text,
                };
            }),
        ];
    }, [efforts, allowsAuto, allowsNew]);

    //This is where we take the internal state of the component and turn it into a useful output
    useEffect(() => {
        if (!onChange) return;
        if (loading) return;
        if (!fullProject) return;

        let newId = -3;
        let newTitle = "";
        if (project.id < 0) {
            //new project
            newId = selectedId < 0 ? selectedId : -1;
            newTitle = selectedId === -2 ? customTitle || entry.title : entry.title;
        } else {
            if (selectedId === -2) {
                newId = selectedId;
                newTitle = customTitle || entry.title;
            } else if (selectedId >= 0) {
                const effort = efforts.find(e => e.id === selectedId);
                if (!effort) throw new Error("No effort found with id " + selectedId);
                newId = selectedId;
                newTitle = effort.title;
            } else {
                const autoSelection = SelectAutoEffort(entry, fullProject);
                newId = autoSelection.id;
                newTitle = autoSelection.title;
            }
        }
        if (newId !== value.id || newTitle !== value.title) {
            onChange({
                id: newId,
                title: newTitle,
            });
        }
    }, [loading, value, entry, project, fullProject, efforts, selectedId, customTitle]);

    //Reset to an empty effort when the project
    useEffect(() => {
        setSelectedId(-1);
    }, [project]);

    useEffect(() => {
        const loadEfforts = async (pId: number) => {
            if (pId < 0) return;

            setLoading(true);
            setFullProject(null);
            const efforts = await ClientEffort.getMultipleOverview(true, undefined, undefined, {
                projectId: pId,
            });
            const newFullProject = await ClientProject.getOverview(pId, true);
            setFullProject(newFullProject);
            efforts.sort(Effort.sortByLatest);
            setLoading(false);
            setEfforts(efforts);
        };

        setEfforts([]);
        if (!project || project.id < 0) {
            setFullProject(Project.createD2C(project.name));
            return;
        }
        loadEfforts(project.id);
    }, [project]);

    if (loading) {
        return (
            <TextField
                id={id}
                label={label}
                value="Loading..."
                error={error}
                className={className}
            />
        );
    }

    return (
        <>
            <SelectField
                id={id}
                value={selectedId}
                error={error}
                label={label}
                onChange={e => setSelectedId(Number(e.value))}
                options={options}
                className={className}
            />
            {selectedId === -2 ? (
                <div className="flex gap-5 px-10">
                    <TextField
                        id="newEffortTitle"
                        label="Effort Title (optional)"
                        value={customTitle}
                        onChange={setCustomTitle}
                        placeholder={entry.title || "New effort title"}
                    />
                </div>
            ) : null}
            {selectedId === -1 && value.id >= 0 && (
                <p className="text-sm text-neutral-400 -my-4 mb-0 text-right">
                    Auto effort selected:{" "}
                    {efforts.find(e => e.id === value.id)?.title || "notfound"}
                </p>
            )}
            {selectedId === -1 && value.id < 0 && (
                <p className="text-sm text-neutral-400 -my-4 mb-0 text-right">
                    Auto effort will create a new effort
                    {customTitle || entry.title ? ` named: ${customTitle || entry.title}` : ""}
                </p>
            )}
        </>
    );
};

export default EffortSelector;
