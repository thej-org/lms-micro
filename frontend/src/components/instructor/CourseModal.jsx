import { DeleteFilled } from '@ant-design/icons';
import { Button, Form, Input, Modal, Space, message } from 'antd';
import React, { useEffect } from 'react';
import { useCreateCourse, useUpdateCourse } from '../../hooks/courseHooks';

export const CourseModal = ({ isEdit, course, onClose, isOpen }) => {
    const [form] = Form.useForm();
    const { mutate: createCourse, isLoading, isSuccess: created } = useCreateCourse();
    const { mutate: editCourse, isLoading: isEditLoading, isSuccess: updated } = useUpdateCourse();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (isEdit) {
                editCourse({ courseId: course._id, values });
            } else {
                createCourse(values);
            }
        } catch (error) {
            message.error('Please fill in all required fields');
        }
    };

    const handleCancel = () => {
        onClose();
        form.resetFields();
    };

    useEffect(() => {
        if (created || updated) {
            handleCancel();
        }
    }, [created, updated]);

    useEffect(() => {
        if (isEdit) {
            form.setFieldsValue(course);
        } else {
            form.resetFields();
        }
    }, [isOpen]);

    return (
        <>
            <>
                <Modal
                    width={800}
                    title={isEdit ? 'Edit Course' : 'Create Course'}
                    open={isOpen}
                    onOk={handleOk}
                    confirmLoading={isLoading || isEditLoading}
                    okText={isEdit ? 'Edit' : 'Create'}
                    onCancel={handleCancel}
                >
                    <Form form={form} layout="vertical" name="course_form">
                        <Form.Item
                            name="courseCode"
                            label="Course Code"
                            rules={[{ required: true, message: 'Please input the course code!' }]}
                        >
                            <Input placeholder="Enter course code" />
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="Course Name"
                            rules={[{ required: true, message: 'Please input the course name!' }]}
                        >
                            <Input placeholder="Enter course name" />
                        </Form.Item>
                        <Form.List name="courseContent">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'self-end',
                                            }}
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'lectureNumber']}
                                                label="Lecture Number"
                                                rules={[
                                                    { required: true, message: 'Please input the lecture number!' },
                                                ]}
                                            >
                                                <Input placeholder="Enter lecture number" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'lecturePdfUrl']}
                                                label="PDF URL"
                                                rules={[{ required: true, message: 'Please input the PDF URL!' }]}
                                            >
                                                <Input placeholder="Enter PDF URL" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'lectureVideoUrl']}
                                                label="Video URL"
                                                rules={[{ required: true, message: 'Please input the video URL!' }]}
                                            >
                                                <Input placeholder="Enter video URL" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'lectureQuizUrl']}
                                                label="Quiz URL"
                                                rules={[{ required: true, message: 'Please input the quiz URL!' }]}
                                            >
                                                <Input placeholder="Enter quiz URL" />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button danger onClick={() => remove(name)}>
                                                    <DeleteFilled />
                                                </Button>
                                            </Form.Item>
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block>
                                            Add Lecture
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form>
                </Modal>
            </>
        </>
    );
};

export default CourseModal;
