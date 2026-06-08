import { Upload, message } from "antd";
import type {
    RcFile,
    UploadFile,
} from "antd/es/upload/interface";

interface Props {
    setImages:
        React.Dispatch<
            React.SetStateAction<
                File[]
            >
        >;
}

const ProductImageUpload = ({
    setImages,
}: Props) => {
    const handleUpload = (
        file: RcFile,
    ) => {
        const isValid =
            [
                "image/jpeg",
                "image/png",
                "image/webp",
            ].includes(
                file.type,
            );

        if (!isValid) {
            message.error(
                "Only JPG, PNG, WEBP allowed",
            );

            return Upload.LIST_IGNORE;
        }

        if (
            file.size >
            5 *
                1024 *
                1024
        ) {
            message.error(
                "Max 5MB",
            );

            return Upload.LIST_IGNORE;
        }

        setImages(
            (
                prev,
            ) => [
                ...prev,
                file,
            ],
        );

        return false;
    };

    return (
        <Upload
            multiple
            listType="picture-card"
            beforeUpload={
                handleUpload
            }
            onRemove={(
                file: UploadFile,
            ) => {
                setImages(
                    (
                        prev,
                    ) =>
                        prev.filter(
                            (
                                f,
                            ) =>
                                f.name !==
                                file.name,
                        ),
                );

                return true;
            }}
        >
            Upload
        </Upload>
    );
};

export default ProductImageUpload;