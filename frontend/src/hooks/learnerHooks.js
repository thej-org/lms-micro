import { message } from 'antd';
import { useMutation, useQuery } from 'react-query';
import { http } from './api';

export const useGetCoursebyCode = (courseCode) => {
    console.log('cc: ', courseCode);
    return useQuery(
        'courses',
        async () => {
            const response = await http.get(`/course/courseCode/${courseCode}`, {
                withCredentials: 'include',
            });
            console.log('hook data', response.data);
            return response.data.course;
        },
        {
            refetchOnWindowFocus: true,
            onError: (error) => {
                message.error(error.response.data.message);
            },
        },
    );
};

export const useGetCurrentLearner = () => {
    return useQuery(
        'learners',
        async () => {
            const response = await http.get(`/learner/user`, {
                withCredentials: 'include',
            });
            console.log('hook data', response.data);
            return response.data.learner;
        },
        {
            refetchOnWindowFocus: true,
            onError: (error) => {
                message.error(error.response.data.message);
            },
        },
    );
};

export const useAddProgress = () => {
    return useMutation(
        async ({ courseCode, course }) => {
            const response = await http.patch(`/learner/progress/${courseCode}`, course, {
                withCredentials: 'include',
            });
            return response.data;
        },
        {
            onError: (error) => {
                message.error(error.response.data.message);
            },
        },
    );
};

export const LearnerEnroll = () => {
    return useMutation(
        async (courseCode) => {
            const response = await http.patch(`/learner/enrol`, courseCode, {
                withCredentials: 'include',
            });
            return response.data;
        },
        {
            onError: (error) => {
                message.error(error.response.data.message);
            },
        },
    );
};

export const learnerViewCourse = () => {
    return useMutation(
        'learners', // Set courseCode as part of the query key
        async ({courseCode}) => {
            console.log('Async course code: ', courseCode);
            const response = await http.get(`/learner/course/${courseCode}`, {
                withCredentials: 'include',
            });
            console.log('hook data', response.data);
            return response.data.learner;
        },
        {
            refetchOnWindowFocus: true,
            onError: (error) => {
                console.log("Error: ", error)
                message.error(error.response.data.message);
            },
        },
    );
};

export const LearnerUnenroll = () => {
    return useMutation(
        async ({ courseCode, course }) => {
            const response = await http.patch(`/learner/unenrol/${courseCode}`, course, {
                withCredentials: 'include',
            });
            return response.data;
        },
        {
            onError: (error) => {
                message.error(error.response.data.message);
            },
        },
    );
};
