import { Button, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useApproveDeclineCourse, useGetCourses } from '../../hooks/courseHooks';

const ApprovalTable = () => {
    const { data, isLoading, refetch } = useGetCourses();
    const { mutate: approval, isSuccess } = useApproveDeclineCourse();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (data) {
            const pendingCourses = data.filter((course) => course.approval === 'pending');
            setCourses(pendingCourses);
        }
    }, [data]);

    useEffect(() => {
        if (isSuccess) {
            refetch();
        }
    }, [isSuccess]);

    const handleApproval = async (record, approvalStatus) => {
        await approval({ courseId: record._id, approval: approvalStatus });
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
                <div>
                    <Button onClick={() => handleApproval(record, 'true')} type="primary">
                        Approve
                    </Button>
                    <Button onClick={() => handleApproval(record, 'false')} style={{ marginLeft: 8 }}>
                        Decline
                    </Button>
                </div>
            ),
        },
    ];

    return <Table loading={isLoading} dataSource={courses} columns={columns} bordered pagination={false} />;
};

export default ApprovalTable;
