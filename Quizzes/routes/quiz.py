import warnings
warnings.filterwarnings("ignore")
from Quizzes.services import get_llm,quiz_with_llm
from fastapi import APIRouter,File, UploadFile, HTTPException, status
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from typing import Dict, Any
import tempfile
import os
import logging
from pathlib import Path
from Quizzes.doc_services import quiz_service

class QuizRequest(BaseModel):
    Topic:str

model=get_llm()

quiz_router=APIRouter()
@quiz_router.post("/quiz")
async def Quiz_generator(request:QuizRequest):
    try:
        final_quiz=await quiz_with_llm(llm=model,Topic=request.Topic)
        return {
            "quiz":final_quiz
        }
    except Exception as e:
        return {"error":str(e)}
    

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@quiz_router.post("/quiz_with_file", response_model=Dict[str, Any])
async def quiz_with_file_endpoint(
    file: UploadFile = File(..., description="Upload PDF, DOCX, or PPTX file for quiz generation")
) -> JSONResponse:
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided"
        )
    file_extension = Path(file.filename).suffix.lower()
    supported_formats = {'.pdf', '.docx', '.pptx'}
    
    if file_extension not in supported_formats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format: {file_extension}. Supported formats: {', '.join(supported_formats)}"
        )
    temp_file = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        logger.info(f"Processing file: {file.filename} (Size: {len(content)} bytes)")
        result = await quiz_service.quiz_with_file(temp_file_path)
        
        logger.info(f"Quiz generation completed. Success: {result['success']}")
        if result['success']:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content=result
            )
        else:
            return JSONResponse(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                content=result
            )
    
    except FileNotFoundError as e:
        logger.error(f"File not found error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File not found: {str(e)}"
        )
    
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    
    except Exception as e:
        logger.error(f"Unexpected error in quiz generation: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
    
    finally:
        if temp_file and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
                logger.info("Temporary file cleaned up")
            except Exception as e:
                logger.warning(f"Failed to clean up temporary file: {str(e)}")