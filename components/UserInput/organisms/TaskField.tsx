import dayjs from "dayjs";
import { ProjectTask } from "lib/types/taskTypes";
import DateField from "../molecules/DateField";
import TextField from "../molecules/TextField";
import ToggleField from "../molecules/ToggleField";

const TaskField = ({
    value,
    onChange,
    options,
}: {
    value?: ProjectTask;
    onChange: (task: ProjectTask) => void;
    options?: Partial<{
        showToggle: boolean;
    }>;
}): JSX.Element => {
    const getDefaultValue = (): ProjectTask => {
        return {
            title: "",
            createdAt: dayjs().startOf("day").toDate(),
            changedAt: dayjs().startOf("day").toDate(),
        };
    };

    return (
        <div className="flex justify-between gap-4 items-center">
            <TextField
                id="title"
                label="title"
                value={value?.title || ""}
                onChange={val => onChange({ ...(value || getDefaultValue()), title: val })}
                wrapperClassName=""
            />
            <DateField
                id="createdAt"
                label="Date"
                value={value?.createdAt || dayjs().startOf("day").toDate()}
                onChange={val => onChange({ ...(value || getDefaultValue()), createdAt: val })}
                wrapperClassName="grow-0"
            />
            {options?.showToggle && (
                <ToggleField
                    id="completed"
                    label="Completed"
                    value={!!value?.isDone}
                    onChange={val => {
                        if (val) onChange({ ...(value || getDefaultValue()), isDone: true });
                        else
                            onChange(
                                !value
                                    ? getDefaultValue()
                                    : {
                                          title: value.title,
                                          createdAt: value.createdAt,
                                          changedAt: value.changedAt,
                                      }
                            );
                    }}
                />
            )}
        </div>
    );
};

export default TaskField;
