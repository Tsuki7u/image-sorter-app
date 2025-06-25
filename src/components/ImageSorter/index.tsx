'use client';

import { useState, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  url: string;
  index: number;
}

function SortableItem({ id, url, index }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        flex items-center space-x-4 p-4 border rounded-lg bg-white/90 backdrop-blur-sm
        ${isDragging ? 'shadow-lg opacity-50' : 'hover:shadow-md'}
        transition-all duration-200 cursor-move
      `}
    >
      <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-sm font-medium text-teal-700">
        {index + 1}
      </div>

      <div className="flex-shrink-0">
        <img
          src={url}
          alt={`Image ${index + 1}`}
          className="w-20 h-20 object-cover rounded-lg border border-teal-100"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0MEw0MCA0MEw0MCA0MEw0MCA0MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate font-medium">
          Image {index + 1}
        </p>
        <p className="text-xs text-gray-500 truncate mt-1">
          {url}
        </p>
      </div>

      <div className="flex-shrink-0 text-teal-400">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </div>
    </div>
  );
}

export default function ImageSorter() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // const loadDefaultFile = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch('/output.txt');
  //     if (response.ok) {
  //       const text = await response.text();
  //       const urls = text.split('\n').filter(Boolean);
  //       setImages(urls);
  //       setFileName('output.txt (默认)');
  //     }
  //   } catch {
  //     console.log('No default file found, waiting for upload');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      alert('请选择 .txt 文件');
      return;
    }

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const urls = text.split('\n').filter(url => url.trim());
      setImages(urls);
      setFileName(file.name);
      setLoading(false);
    };

    reader.onerror = () => {
      alert('文件读取失败');
      setLoading(false);
    };

    reader.readAsText(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const clearImages = () => {
    setImages([]);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const exportFile = () => {
    const blob = new Blob([images.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sorted-images-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item, index) => `item-${index}` === active.id);
        const newIndex = items.findIndex((item, index) => `item-${index}` === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-teal-700">Loading images...</div>
      </div>
    );
  }

  return (
    
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-800">图片排序工具 ({images.length} images)</h1>
        <div className="flex space-x-2">
          {images.length > 0 && (
            <button
              onClick={exportFile}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-200 shadow-md"
            >
              导出排序结果
            </button>
          )}
        </div>
      </div>

      {/* 文件上传区域 */}
      <div className="mb-6 p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border-2 border-dashed border-teal-200">
        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="hidden"
          />

          {images.length === 0 ? (
            <div>
              <svg className="mx-auto h-12 w-12 text-teal-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="text-lg font-medium text-teal-800 mb-2">上传图片URL文件</h3>
              <p className="text-sm text-teal-600 mb-4">选择包含图片URL的 .txt 文件（每行一个URL）</p>
              <button
                onClick={triggerFileUpload}
                className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-200"
              >
                选择文件
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <svg className="h-8 w-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg font-medium text-teal-800">已加载文件: {fileName}</span>
              </div>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={triggerFileUpload}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-200"
                >
                  更换文件
                </button>
                <button
                  onClick={clearImages}
                  className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg transition-colors duration-200"
                >
                  清空列表
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <>
          <div className="mb-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-teal-100">
            <p className="text-sm text-teal-700">
              💡 提示：拖拽图片可以重新排序，完成后点击&ldquo;导出排序结果&rdquo;保存新的顺序
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((_, index) => `item-${index}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {images.map((url, index) => (
                  <SortableItem
                    key={`item-${index}`}
                    id={`item-${index}`}
                    url={url}
                    index={index}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}