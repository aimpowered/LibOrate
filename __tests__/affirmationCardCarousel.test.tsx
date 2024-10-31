import '@testing-library/jest-dom'
import { fireEvent, getByTestId, render, screen } from '@testing-library/react'
import { AffirmationCarousel } from '@/components/AffirmationCarousel';


const affirmationCarouselProps = 
    [
        {
            id: 1,
            text: 'sample affirmation 1'
        },
        {
            id: 2,
            text: 'sample affirmation 2'
        },
        {
            id: 30,
            text: 'sample affirmation 30'
        }
    ];

jest.mock('next/navigation', () => jest.requireActual('next-router-mock'));

describe('Test the function of affirmation card carousel', () => {
    it('should display all initial affirmations', () => {
        render(
            <AffirmationCarousel
            initialAffirmations={affirmationCarouselProps}
            />
        );
        expect(screen.getByText("sample affirmation 1")).toBeTruthy();
        expect(screen.getByTestId("carousel-previous-button")).toBeTruthy();
        expect(screen.getByTestId("carousel-next-button")).toBeTruthy();
    });
    
});