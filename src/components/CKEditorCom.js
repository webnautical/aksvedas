import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const CKEditorCom = ({ handleEditorChange, ckValue }) => {
    const handleChange = (event, editor) => {
        const data = editor.getData();
        handleEditorChange(data)
    };
    return (
        <>
            <CKEditor
                editor={ClassicEditor}
                data={ckValue}
                onChange={handleChange}
                config={{
                    ckfinder: {
                        uploadUrl: 'https://aksvedas.com/api/upload'
                    },
                    image: {
                        toolbar: [
                            'imageTextAlternative', 'imageStyle:full', 'imageStyle:side'
                        ]
                    }
                }}
            />
        </>
    )
}

export default CKEditorCom