import { Button, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDeleteCourse, useGetCourses } from '../../hooks/courseHooks';
import CourseModal from '../instructor/CourseModal';

const InstructorTable = () => {
    const { mutate: deleteCourse, isSuccess: deleted } = useDeleteCourse();
    const { data: allCourses, isLoading, refetch } = useGetCourses();
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const handleModal = (record) => {
        setCourse(record);
        setIsOpen(true);
        setIsEdit(true);
    };

    const handleCreateCourse = () => {
        setCourse({});
        setIsOpen(true);
        setIsEdit(false);
    };

    const columns = [
        {
            title: 'Course Code',
            dataIndex: 'courseCode',
            key: 'courseCode',
            width: '10%',
        },
        {
            title: 'Course Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'action',
            render: (record) => (
                <>
                    <Button type="primary" onClick={() => handleModal(record)}>
                        Edit
                    </Button>
                    <Button
                        danger
                        type="primary"
                        style={{ marginLeft: '8px' }}
                        onClick={() => {
                            deleteCourse({ courseId: record._id });
                            refetch();
                        }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    useEffect(() => {
        setCourses(allCourses);
    }, [allCourses]);

    useEffect(() => {
        refetch();
    }, [deleted]);

    return (
        <>
            <Button type="primary" onClick={handleCreateCourse}>
                Create Course
            </Button>
            <CourseModal
                isEdit={isEdit}
                course={course}
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setCourse({});
                    refetch();
                    setIsEdit(false);
                }}
            />
            <Table loading={isLoading} dataSource={courses} columns={columns} bordered pagination={false} />
        </>
    );
};

export default InstructorTable;
