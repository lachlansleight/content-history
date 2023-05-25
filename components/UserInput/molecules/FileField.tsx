import { useCallback, useState } from "react";
import { DropzoneOptions, FileRejection, useDropzone } from "react-dropzone";
import FieldWrapper from "../atoms/FieldWrapper";

const FileField = ({
    id,
    value,
    label,
    error,
    onChange,
    className,
    options,
}: {
    id: string;
    value?: File[];
    label?: string;
    error?: string;
    onChange?: (newVal: File[]) => void;
    className?: string;
    options?: DropzoneOptions;
}): JSX.Element => {
    const [files, setFiles] = useState<File[]>(value || []);
    const [actualError, setActualError] = useState(error || "");

    const onDropAccepted = useCallback(
        (acceptedFiles: File[]) => {
            setFiles(acceptedFiles);
            if (onChange) onChange(acceptedFiles);
        },
        [onChange]
    );

    const onDropRejected = useCallback((rejections: FileRejection[]) => {
        setActualError(rejections[0].errors[0].message);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDropAccepted,
        onDropRejected,
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"],
            "image/gif": [".gif"],
            "video/mp4": [".mp4"],
        },
        maxSize: 10485760, //10MB
        multiple: true,
        ...options,
    });

    return (
        <FieldWrapper id={id} label={label} error={actualError}>
            <div
                {...getRootProps()}
                className={`${
                    className || ""
                } w-full h-12 border border-dashed grid place-items-center mb-5 ${
                    isDragActive ? "border-white" : "border-neutral-700"
                }`}
            >
                <input {...getInputProps()} />
                {files?.length ? (
                    <span>{files[0].name}</span>
                ) : isDragActive ? (
                    <span>Drop the files here ...</span>
                ) : (
                    <span className="text-sm text-neutral-200 text-opacity-30 h-full grid place-items-center">
                        {!options || options.multiple
                            ? "Drag + drop some files here, or click to select files"
                            : "Drag + drop a file here, or click to select a file"}
                    </span>
                )}
            </div>
        </FieldWrapper>
    );
};

export default FileField;
