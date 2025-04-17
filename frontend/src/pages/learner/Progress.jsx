import { DeleteFilled } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAddProgress } from '../../hooks/learnerHooks';
// import { useCreateCourse } from '../../hooks/courseHooks';
const ProgressModal = ({ isEdit, courseCode, onUpdateProgress }) => {
    console.log('cc', courseCode);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    const { mutate: addProgress, isLoading, isSuccess } = useAddProgress(courseCode);

    // const [isLoading, setIsLoading] = useState(false);
    // const [isSuccess, setIsSuccess] = useState(false);
    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            var modifiedValues = {
                completedLectures: Number(values.completedLectures),
                quizScores: [
                    { quizNumber: 1, score: Number(values.Score01) },
                    { quizNumber: 2, score: Number(values.Score02) },
                    { quizNumber: 3, score: Number(values.Score03) },
                    { quizNumber: 4, score: Number(values.Score04) },
                    { quizNumber: 5, score: Number(values.Score05) },
                ],
            };
            // addProgress(modifiedValues);
            const progress = 50;
            onUpdateProgress(progress);
            setOpen(false);
            addProgress({ courseCode: courseCode, course: modifiedValues });
            console.log('Received values of form:', modifiedValues);
        });
    };

    useEffect(() => {
        if (isSuccess) {
            setOpen(false);
            setConfirmLoading(false);
            form.resetFields();
        }
    }, [isLoading, isSuccess]);

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    return (
        <>
            {isEdit ? (
                ''
            ) : (
                <>
                    <Button type="primary" style={{ marginTop: '10px' }} onClick={showModal}>
                        Add Progress
                    </Button>
                    <Modal
                        width={800}
                        title="Add Course Progress"
                        open={open}
                        footer={[
                            <Button key="back" onClick={handleCancel}>
                                Cancel
                            </Button>,
                            <Button key="submit" type="primary" loading={confirmLoading} onClick={handleOk}>
                                Add
                            </Button>,
                        ]}
                        confirmLoading={confirmLoading}
                        onCancel={handleCancel}
                    >
                        <Form form={form} layout="vertical" name="course_form">
                            <Form.Item name="courseCode" label="Course Code">
                                <Input defaultValue={courseCode} placeholder="Enter course code" disabled />
                            </Form.Item>
                            <Form.Item
                                name="completedLectures"
                                label="Completed Lectures"
                                rules={[{ required: true, message: 'Please input the course name!' }]}
                            >
                                <Input placeholder="Enter course name" />
                            </Form.Item>

                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        name="Score01"
                                        label="Quiz Number 01"
                                        rules={[{ required: true, message: 'Please input the quiz score' }]}
                                    >
                                        <Input placeholder="Enter lecture number" />
                                    </Form.Item>
                                </Col>
                                <Col span={12} style={{ paddingLeft: '10px' }}>
                                    <Form.Item
                                        name="Score02"
                                        label="Quiz Number 02"
                                        rules={[{ required: true, message: 'Please input the quiz score' }]}
                                    >
                                        <Input placeholder="Enter PDF URL" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        name="Score03"
                                        label="Quiz Number 03"
                                        rules={[{ required: true, message: 'Please input the quiz score' }]}
                                    >
                                        <Input placeholder="Enter lecture number" />
                                    </Form.Item>
                                </Col>
                                <Col span={12} style={{ paddingLeft: '10px' }}>
                                    <Form.Item
                                        name="Score04"
                                        label="Quiz Number 04"
                                        rules={[{ required: true, message: 'Please input the quiz score' }]}
                                    >
                                        <Input placeholder="Enter PDF URL" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        name="Score05"
                                        label="Quiz Number 05"
                                        rules={[{ required: true, message: 'Please input the quiz score' }]}
                                    >
                                        <Input placeholder="Enter lecture number" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                </>
            )}
        </>
    );
};

export default ProgressModal;
