import { Button, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCourses } from '../../hooks/courseHooks';
import { LearnerEnroll, learnerViewCourse } from '../../hooks/learnerHooks';

const LearnerTable = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetCourses();
    const [courses, setCourses] = useState([]);
    const { mutate: enrol } = LearnerEnroll();
    const { mutate: viewCourse, isSuccess } = learnerViewCourse();

    const handleViewCourse = (courseCode) => {
        viewCourse({ courseCode: courseCode });
        console.log('CourseCode: ', courseCode);
    };

    useEffect(() => {}, []);

    useEffect(() => {
        if (data) {
            setCourses(data);
        }
    }, [data]);

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
                <div>
                    <Button
                        type="primary"
                        onClick={() => {
                            handleViewCourse(record.courseCode);
                            // alert('Please enrol to course to view details');
                        }}
                    >
                        View
                    </Button>
                    <Button
                        type="link"
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                            enrol({ courseCode: record.courseCode });
                            navigate(`/learner/${record.courseCode}`);
                        }}
                    >
                        Enroll
                    </Button>
                </div>
            ),
        },
    ];

    return <Table loading={isLoading} dataSource={courses && courses} columns={columns} bordered pagination={false} />;
};

export default LearnerTable;
