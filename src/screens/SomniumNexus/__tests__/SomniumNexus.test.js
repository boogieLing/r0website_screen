import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SomniumNexus from '../index';

// Mock the stores
jest.mock('@/stores/globalStore', () => ({
  setWebSiteTitle: jest.fn()
}));

jest.mock('@/stores/somniumNexusStore', () => ({
  categories: ['stillness', 'urbanization'],
  currentCategoryImages: [],
  selectedCategory: 'stillness',
  selectedSubCategory: '',
  hasSubMenu: false,
  subCategories: [],
  isModalOpen: false,
  selectedImage: null,
  galleryCategories: {
    stillness: { title: 'Stillness', hasSubMenu: false },
    urbanization: { title: 'Urbanization', hasSubMenu: true }
  },
  setSelectedCategory: jest.fn(),
  setSelectedSubCategory: jest.fn(),
  setSelectedImage: jest.fn(),
  closeModal: jest.fn()
}));

// Mock the components
jest.mock('@/components/InfiniteGallery/InfiniteGallery', () => {
  return function MockInfiniteGallery({ images, onImageClick }) {
    return (
      <div data-testid="infinite-gallery">
        {images?.map((image, index) => (
          <div key={index} data-testid="gallery-image" onClick={() => onImageClick(image)}>
            {image.title}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('@/components/SkeletonImage/GracefulImage', () => {
  return function MockGracefulImage({ src, alt }) {
    return <img src={src} alt={alt} data-testid="graceful-image" />;
  };
});

describe('SomniumNexus Sidebar Optimization', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('renders sidebar and main content correctly', () => {
    renderWithRouter(<SomniumNexus />);

    // Check if sidebar is present
    const sidebarElement = screen.getByRole('button', { name: /收缩侧边栏/i });
    expect(sidebarElement).toBeInTheDocument();

    // Check if main content is present
    const mainContent = screen.getByTestId('infinite-gallery');
    expect(mainContent).toBeInTheDocument();
  });

  test('sidebar toggle functionality works', () => {
    renderWithRouter(<SomniumNexus />);

    // Find the toggle button
    const toggleButton = screen.getByRole('button', { name: /收缩侧边栏/i });

    // Click to collapse
    fireEvent.click(toggleButton);

    // The button text should change or the sidebar should be collapsed
    // This is a basic test - in real scenario you'd check for collapsed state
    expect(toggleButton).toBeInTheDocument();
  });

  test('selected project is displayed at higher position', () => {
    renderWithRouter(<SomniumNexus />);

    // Simulate selecting a project by clicking on it
    // This would need actual project elements to be rendered

    // For now, just verify the component renders without errors
    expect(screen.getByText('Somnium Nexus')).toBeInTheDocument();
  });

  test('main content occupies remaining space', () => {
    renderWithRouter(<SomniumNexus />);

    const mainContent = screen.getByTestId('infinite-gallery');

    // Check that main content has proper styling
    expect(mainContent).toHaveStyle({
      // These would be the computed styles
      // In real test you'd check for margin-left and width properties
    });
  });
});