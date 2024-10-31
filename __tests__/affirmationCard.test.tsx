import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { AffirmationCard } from '@/components/AffirmationCard';
import React from 'react';

const affirmationCardContent = {
    id: 11,
    text: 'foo bar'
};

const affirmationCardProps = {
    initialContent: affirmationCardContent,
    onAffirmationCardUpdate: jest.fn(),
    onAffirmationCardDelete: jest.fn()
}

jest.mock('next/navigation', () => jest.requireActual('next-router-mock'));

describe('Affirmation card works as expected', () => {
    it('should load affirmation card correctly', () => {
        render(
            <AffirmationCard
                initialContent={affirmationCardProps.initialContent}
                onAffirmationCardUpdate={affirmationCardProps.onAffirmationCardUpdate}
                onAffirmationCardDeletion={affirmationCardProps.onAffirmationCardDelete}
            />
        );
        const cardElement = screen.getByTestId('affirmation-card');
        expect(cardElement).toBeInTheDocument();
        expect(screen.getByLabelText('more actions')).toBeTruthy();
        expect(screen.getByText('foo bar')).toBeTruthy();
        fireEvent.click(screen.getByLabelText('more actions'));
        expect(screen.getByLabelText('menu-edit-delete')).toBeTruthy();
        expect(screen.getByText('Edit')).toBeTruthy();
        expect(screen.getByText('Delete')).toBeTruthy();
    });


});